"use client"

import { useState, useRef, useCallback } from "react"

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
  
  // Precise playback timing management
  const nextStartTimeRef = useRef<number>(0)
  const LOOKAHEAD = 0.1 // 100ms buffer for jitter

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
    nextStartTimeRef.current = 0
  }, [])

  const schedulePlayback = useCallback((pcm16: Int16Array) => {
    const audioCtx = audioContextRef.current
    if (!audioCtx) return

    // Convert Int16 to Float32
    const float32Data = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32Data[i] = pcm16[i] / 32768.0
    }

    const duration = float32Data.length / 24000
    const buffer = audioCtx.createBuffer(1, float32Data.length, 24000)
    buffer.getChannelData(0).set(float32Data)

    const source = audioCtx.createBufferSource()
    source.buffer = buffer
    source.connect(audioCtx.destination)

    // Calculate start time
    const currentTime = audioCtx.currentTime
    if (nextStartTimeRef.current < currentTime) {
      // If we're behind or just starting, schedule with a small lookahead
      nextStartTimeRef.current = currentTime + LOOKAHEAD
    }

    source.start(nextStartTimeRef.current)
    nextStartTimeRef.current += duration
  }, [])

  const startSession = useCallback(async () => {
    try {
      setStatus("connecting")
      nextStartTimeRef.current = 0

      // 1. Get temporary token
      console.log("Starting voice session, fetching token...")
      const tokenRes = await fetch("/api/aai-token", { method: "POST" })
      
      if (!tokenRes.ok) {
        let errorMessage = `Server Error (${tokenRes.status})`
        try {
          const errorData = await tokenRes.json()
          errorMessage = errorData.error || errorMessage
        } catch (e) {
          console.error("Non-JSON response from token endpoint")
        }
        throw new Error(errorMessage)
      }
      
      const { token } = await tokenRes.json()
      console.log("Token received successfully.")

      // 2. Initialize Audio Context (24kHz is required for AssemblyAI Voice Agent)
      const audioCtx = new AudioContext({ sampleRate: 24000 })
      audioContextRef.current = audioCtx

      // 3. Connect WebSocket
      const socket = new WebSocket(`wss://agents.assemblyai.com/v1/ws?token=${token}`)
      socketRef.current = socket

      socket.onopen = () => {
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
            onMessage?.({ role: "user", content: msg.text })
            break
          
          case "transcript.agent":
            onMessage?.({ role: "assistant", content: msg.text })
            break

          case "reply.started":
            setIsSpeaking(true)
            break
          
          case "reply.done":
            setIsSpeaking(false)
            if (msg.status === "interrupted") {
              // Reset the timeline if interrupted to prevent playing stale audio
              nextStartTimeRef.current = 0
            }
            break

          case "reply.audio":
            try {
              const binaryString = atob(msg.data)
              const bytes = new Uint8Array(binaryString.length)
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i)
              }
              const pcm16 = new Int16Array(bytes.buffer)
              schedulePlayback(pcm16)
            } catch (e) {
              console.error("Failed to decode audio chunk:", e)
            }
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
      
      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      processorRef.current = processor

      processor.onaudioprocess = (e) => {
        if (socket.readyState !== WebSocket.OPEN) return

        const inputData = e.inputBuffer.getChannelData(0)
        const pcm16 = new Int16Array(inputData.length)
        for (let i = 0; i < inputData.length; i++) {
          pcm16[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF
        }

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
  }, [onMessage, onError, schedulePlayback, stopSession])

  const sendText = useCallback((text: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ 
        type: "input.text", 
        text: text 
      }))
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
