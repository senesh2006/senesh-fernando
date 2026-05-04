"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere, Torus, Environment } from "@react-three/drei"
import * as THREE from "three"

function FloatingOrb({ position, scale, speed, distort }: { 
  position: [number, number, number]
  scale: number
  speed: number
  distort: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.5
    }
  })
  
  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={scale} position={position}>
        <MeshDistortMaterial
          color="#ff6a00"
          roughness={0.2}
          metalness={0.8}
          distort={distort}
          speed={2}
          transparent
          opacity={0.8}
        />
      </Sphere>
    </Float>
  )
}

function FloatingRing({ position, scale, speed }: {
  position: [number, number, number]
  scale: number
  speed: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3
    }
  })
  
  return (
    <Float speed={speed * 0.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Torus ref={meshRef} args={[1, 0.1, 16, 100]} scale={scale} position={position}>
        <meshStandardMaterial
          color="#ff8533"
          roughness={0.3}
          metalness={0.9}
          transparent
          opacity={0.7}
        />
      </Torus>
    </Float>
  )
}

function Particles({ count = 100 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null)
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      // Orange gradient
      colors[i * 3] = 1
      colors[i * 3 + 1] = 0.4 + Math.random() * 0.3
      colors[i * 3 + 2] = 0
    }
    
    return { positions, colors }
  }, [count])
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6a00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff8533" />
      
      <FloatingOrb position={[3, 1, -2]} scale={1.2} speed={1} distort={0.4} />
      <FloatingOrb position={[-3, -1, -3]} scale={0.8} speed={1.5} distort={0.3} />
      <FloatingOrb position={[0, 2, -4]} scale={0.5} speed={2} distort={0.5} />
      
      <FloatingRing position={[-2, 0.5, -1]} scale={1.5} speed={0.8} />
      <FloatingRing position={[2.5, -1, -2]} scale={1} speed={1.2} />
      
      <Particles count={150} />
      
      <Environment preset="night" />
    </>
  )
}

export function Hero3D() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
