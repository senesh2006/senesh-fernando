"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float } from "@react-three/drei"
import * as THREE from "three"

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
      
      // Minimal interaction with mouse
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, state.mouse.x * 0.5, 0.05)
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, state.mouse.y * 0.5, 0.05)
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
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

function InteractiveWireframe() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
      
      // Follow mouse subtly
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, state.mouse.x * 2, 0.03)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, state.mouse.y * 2, 0.03)
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial 
          color="#ff6a00" 
          wireframe 
          transparent 
          opacity={0.15} 
          emissive="#ff6a00"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6a00" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff8533" />
      
      <InteractiveWireframe />
      <Particles count={200} />
      
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
