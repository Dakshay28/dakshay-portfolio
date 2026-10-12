// Lazy-loaded WebGL layer (its own chunk — see vite.config.js).
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { CameraRig, Monitor, CodeTunnel, Browser3D, Starfield, AuroraSky, WarpStreaks, DeployShockwave } from './scene3d/World'

export default function Scene3D({ active = true }) {
  return (
    <Canvas
      // Pause rendering entirely when the hero is off-screen.
      frameloop={active ? 'always' : 'never'}
      // DPR capped at 1.5 — sharp enough, half the fill cost of 2x+.
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45, near: 0.1, far: 120 }}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
      className="!absolute inset-0"
      aria-hidden="true"
    >
      <color attach="background" args={['#0B0716']} />
      <fog attach="fog" args={['#0B0716', 8, 34]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.2} />
      <pointLight position={[0, 0, -30]} intensity={40} distance={40} color="#2DE2C7" />
      <pointLight position={[0, 2, -60]} intensity={60} distance={30} color="#7C5CFF" />
      <CameraRig />
      <AuroraSky />
      <Starfield />
      <WarpStreaks />
      <Monitor />
      <CodeTunnel />
      <Browser3D />
      <DeployShockwave />
      {/* drops resolution while the GPU is struggling, restores when idle */}
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  )
}
