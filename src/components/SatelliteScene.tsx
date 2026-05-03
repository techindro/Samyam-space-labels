import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// Procedural Earth with continents using canvas texture
function useEarthTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext("2d")!;

    // Ocean gradient
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, size / 2);
    oceanGrad.addColorStop(0, "#0a3a6e");
    oceanGrad.addColorStop(0.5, "#1565a8");
    oceanGrad.addColorStop(1, "#0a3a6e");
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, size, size / 2);

    // Stylized continents (rough silhouettes)
    ctx.fillStyle = "#2d6b3a";
    const drawBlob = (cx: number, cy: number, points: [number, number][]) => {
      ctx.beginPath();
      ctx.moveTo(cx + points[0][0], cy + points[0][1]);
      points.forEach(([x, y]) => ctx.lineTo(cx + x, cy + y));
      ctx.closePath();
      ctx.fill();
    };

    // Africa + Europe
    drawBlob(560, 200, [[0, -90], [40, -70], [60, -40], [50, 0], [70, 60], [40, 110], [0, 140], [-30, 100], [-40, 40], [-30, -20], [-20, -60]]);
    // Asia
    drawBlob(700, 150, [[0, -60], [80, -70], [140, -40], [180, -10], [160, 30], [100, 50], [40, 30], [0, 0], [-20, -30]]);
    // Americas
    drawBlob(220, 180, [[0, -100], [30, -60], [40, -10], [20, 40], [40, 90], [20, 140], [-10, 120], [-30, 60], [-20, 0], [-30, -40], [-10, -80]]);
    // Australia
    drawBlob(820, 320, [[0, -25], [50, -20], [70, 10], [40, 30], [-10, 25], [-30, 0]]);
    // India peninsula highlight
    ctx.fillStyle = "#3d8a4a";
    drawBlob(640, 220, [[0, -25], [15, -15], [20, 5], [10, 25], [-5, 30], [-15, 10], [-15, -10]]);

    // Cloud wisps
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size / 2;
      const r = 20 + Math.random() * 50;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Earth() {
  const ref = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const tex = useEarthTexture();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.04;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.055;
  });

  return (
    <group position={[0, -0.2, 0]}>
      {/* Atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial color="#5aa8ff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.04}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshBasicMaterial color="#88c4ff" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>

      {/* Earth */}
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshStandardMaterial map={tex} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} scale={1.012}>
        <sphereGeometry args={[1.6, 48, 48]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.18} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Satellite() {
  const orbit = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbit.current) {
      // Slow orbit around Earth
      orbit.current.rotation.y = t * 0.12;
      orbit.current.rotation.x = Math.sin(t * 0.08) * 0.25;
    }
    if (body.current) {
      // Subtle self rotation, cinematic
      body.current.rotation.y = Math.sin(t * 0.18) * 0.4;
      body.current.rotation.z = Math.sin(t * 0.12) * 0.15;
    }
  });

  return (
    <group ref={orbit}>
      <group ref={body} position={[2.6, 0.4, 0]} scale={0.42}>
        {/* Main bus */}
        <mesh>
          <boxGeometry args={[1.2, 1.2, 1.6]} />
          <meshStandardMaterial color="#e5e5e5" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Gold thermal foil */}
        <mesh>
          <boxGeometry args={[1.21, 0.55, 1.61]} />
          <meshStandardMaterial color="#d4a74a" metalness={0.95} roughness={0.15} emissive="#3a2a00" emissiveIntensity={0.25} />
        </mesh>

        {/* Solar arms */}
        <mesh position={[-1.6, 0, 0]}>
          <boxGeometry args={[2, 0.04, 0.04]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.6, 0, 0]}>
          <boxGeometry args={[2, 0.04, 0.04]} />
          <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Solar panels */}
        <mesh position={[-3.2, 0, 0]}>
          <boxGeometry args={[2.6, 0.05, 1.4]} />
          <meshStandardMaterial color="#1a3a8a" metalness={0.6} roughness={0.3} emissive="#0a1a4a" emissiveIntensity={0.35} />
        </mesh>
        <mesh position={[3.2, 0, 0]}>
          <boxGeometry args={[2.6, 0.05, 1.4]} />
          <meshStandardMaterial color="#1a3a8a" metalness={0.6} roughness={0.3} emissive="#0a1a4a" emissiveIntensity={0.35} />
        </mesh>
        {/* Panel grid lines */}
        {[-3.2, 3.2].map((px) =>
          Array.from({ length: 5 }).map((_, i) => (
            <mesh key={`${px}-${i}`} position={[px, 0.03, -0.6 + i * 0.3]}>
              <boxGeometry args={[2.6, 0.001, 0.012]} />
              <meshBasicMaterial color="#0a1a3a" />
            </mesh>
          ))
        )}

        {/* Dish */}
        <group position={[0, 0.85, 0.2]} rotation={[-0.3, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.05, 0.5, 12]} />
            <meshStandardMaterial color="#aaa" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.35, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.45, 0.25, 32, 1, true]} />
            <meshStandardMaterial color="#f5f5f5" metalness={0.6} roughness={0.4} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>

        {/* Antenna */}
        <mesh position={[0, -0.7, -0.6]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.8, 8]} />
          <meshStandardMaterial color="#ccc" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* ISRO tricolor flag panel */}
        <group position={[0, 0, 0.81]}>
          <mesh position={[0, 0.18, 0]}>
            <planeGeometry args={[0.55, 0.18]} />
            <meshStandardMaterial color="#FF9933" emissive="#FF9933" emissiveIntensity={0.2} />
          </mesh>
          <mesh>
            <planeGeometry args={[0.55, 0.18]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.15} />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <planeGeometry args={[0.55, 0.18]} />
            <meshStandardMaterial color="#138808" emissive="#138808" emissiveIntensity={0.2} />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry args={[0.05, 0.07, 24]} />
            <meshBasicMaterial color="#000080" />
          </mesh>
        </group>

        {/* Sensor */}
        <mesh position={[0, -0.4, 0.81]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} emissive="#003366" emissiveIntensity={0.45} />
        </mesh>

        {/* Status lights */}
        <mesh position={[0.4, 0.4, 0.81]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#22ff66" />
        </mesh>
        <mesh position={[-0.4, 0.4, 0.81]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ff3366" />
        </mesh>
      </group>
    </group>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]} position={[0, -0.2, 0]}>
      <ringGeometry args={[2.55, 2.58, 128]} />
      <meshBasicMaterial color="#88c4ff" transparent opacity={0.15} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CinematicCamera() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const cam = state.camera;
    // Slow cinematic camera arc: front → top → side → bottom → front
    const radius = 6.5;
    const angle = t * 0.06;
    cam.position.x = Math.sin(angle) * radius * 0.4;
    cam.position.y = Math.sin(t * 0.05) * 2.2 + 0.5;
    cam.position.z = Math.cos(angle * 0.7) * radius * 0.6 + 5.5;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

const SatelliteScene = () => {
  return (
    <div className="relative w-full max-w-[480px] aspect-square mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(24,95%,55%)] via-transparent to-[hsl(145,60%,38%)] opacity-15 blur-[60px] animate-pulse-glow" />

      <Canvas
        camera={{ position: [0, 1.5, 6.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CinematicCamera />
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 3, 5]} intensity={1.4} color="#fff7e6" />
        <directionalLight position={[-5, -2, -3]} intensity={0.35} color="#5a8cff" />
        <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffaa55" />

        <Stars radius={60} depth={40} count={1500} factor={2.5} saturation={0} fade speed={0.3} />

        <Earth />
        <OrbitRing />
        <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.18}>
          <Satellite />
        </Float>
      </Canvas>
    </div>
  );
};

export default SatelliteScene;
