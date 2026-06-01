"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export type VoiceStatus = "inactive" | "connecting" | "active" | "error"

interface UseAssemblyAIVoiceOptions {
  onMessage?: (msg: { role: "user" | "assistant"; content: string }) => void
  onError?: (error: string) => void
}

export function useAssemblyAIVoice({ onMessage, onError }: UseAssemblyAIVoiceOptions = {}) {
  const [status, setStatus] = useState<VoiceStatus>("inactive")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const processorRef = useRef<ScriptProcessorNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  
  // Playback queue management
  const audioQueueRef = useRef<Int16Array[]>([])
  const isPlayingRef = useRef(false)

  const stopSession = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "session.terminate" }))
      socketRef.current.close()
      socketRef.current = null
    }

    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop())
      micStreamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    setStatus("inactive")
    setIsSpeaking(false)
    audioQueueRef.current = []
    isPlayingRef.current = false
  }, [])

  const playNextInQueue = useCallback(async () => {
    if (audioQueueRef.current.length === 0 || isPlayingRef.current || !audioContextRef.current) {
      isPlayingRef.current = false
      return
    }

    isPlayingRef.current = true
    const nextChunk = audioQueueRef.current.shift()!
    
    // Convert Int16 to Float32 for Web Audio API
    const float32Data = new Float32Array(nextChunk.length)
    for (let i = 0; i < nextChunk.length; i++) {
      float32Data[i] = nextChunk[i] / 32768.0
    }

    const buffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000)
    buffer.getChannelData(0).set(float32Data)

    const source = audioContextRef.current.createBufferSource()
    source.buffer = buffer
    source.connect(audioContextRef.current.destination)
    
    source.onended = () => {
      isPlayingRef.current = false
      playNextInQueue()
    }

    source.start()
  }, [])

  const startSession = useCallback(async () => {
    try {
      setStatus("connecting")

      // 1. Get temporary token
      const tokenRes = await fetch("/api/voice-token", { method: "POST" })
      if (!tokenRes.ok) throw new Error("Failed to get voice token")
      const { token } = await tokenRes.json()

      // 2. Initialize Audio Context (24kHz is required for AssemblyAI Voice Agent)
      const audioCtx = new AudioContext({ sampleRate: 24000 })
      audioContextRef.current = audioCtx

      // 3. Connect WebSocket
      const socket = new WebSocket(`wss://agents.assemblyai.com/v1/ws?token=${token}`)
      socketRef.current = socket

      socket.onopen = () => {
        // Send session update immediately
        socket.send(JSON.stringify({
          type: "session.update",
          session: {
            system_prompt: "You are Senesh's AI assistant. You are friendly, professional, and concise. You help visitors navigate Senesh Fernando's portfolio and answer questions about his skills and projects.",
            greeting: "Hello! I'm Senesh's voice assistant. How can I help you today?",
            output: { voice: "ivy" }
          }
        }))
      }

      socket.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        
        switch (msg.type) {
          case "session.ready":
            setStatus("active")
            break
          
          case "transcript.user":
            onMessage?.({ role: "user", content: msg.transcript })
            break
          
          case "transcript.agent":
            onMessage?.({ role: "assistant", content: msg.transcript })
            break

          case "reply.started":
            setIsSpeaking(true)
            break
          
          case "reply.done":
            setIsSpeaking(false)
            if (msg.status === "interrupted") {
              audioQueueRef.current = []
            }
            break

          case "reply.audio":
            // Decode base64 to binary
            const binaryString = atob(msg.data)
            const bytes = new Uint8Array(binaryString.length)
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i)
            }
            const pcm16 = new Int16Array(bytes.buffer)
            audioQueueRef.current.push(pcm16)
            playNextInQueue()
            break

          case "error":
            console.error("AssemblyAI Voice Error:", msg.message)
            onError?.(msg.message)
            stopSession()
            break
        }
      }

      socket.onerror = (err) => {
        console.error("WebSocket Error:", err)
        setStatus("error")
        onError?.("Connection error")
      }

      socket.onclose = () => {
        if (status !== "inactive") setStatus("inactive")
      }

      // 4. Capture Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      micStreamRef.current = stream
      const source = audioCtx.createMediaStreamSource(stream)
      
      // ScriptProcessor is legacy but works well for this simple buffer conversion
      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return

        const inputData = e.inputBuffer.getChannelData(0)
        // Convert Float32 to Int16
        const pcm16 = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF
        }

        // Base64 encode and send
        const base64 = btoa(String.fromCharCode(...new Uint8Array(pcm16.buffer)))
        socket.send(JSON.stringify({ type: "input.audio", audio: base64 }))
      }

      source.connect(processor)
      processor.connect(audioCtx.destination)

    } catch (err: any) {
      console.error("Failed to start AssemblyAI session:", err)
      setStatus("error")
      onError?.(err.message || "Failed to start session")
    }
  }, [onMessage, onError, playNextInQueue, status, stopSession])

  const sendText = useCallback((text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      // For Voice Agent, text input is often handled via conversation context
      // but if we want to force a text reply:
      // Note: managed Voice Agent typically expects audio input.
      // However, we can send a session update or similar if needed.
      // For now, let's log that we might need a specific text-to-voice endpoint
      // if we want full text support in this managed mode.
      console.log("Text input in Voice Agent mode:", text)
    }
  }, [])

  return {
    status,
    isSpeaking,
    startSession,
    stopSession,
    sendText
  }
}
