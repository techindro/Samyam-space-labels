import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Float } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function Satellite() {
  const group = useRef<THREE.Group>(null);
  const panelL = useRef<THREE.Mesh>(null);
  const panelR = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      // Cinematic camera-like rotation cycling through front -> top -> bottom -> side
      group.current.rotation.y = Math.sin(t * 0.35) * 0.9;
      group.current.rotation.x = Math.sin(t * 0.25) * 0.6;
      group.current.position.y = Math.sin(t * 0.6) * 0.15;
    }
  });

  // Solar panel cell grid texture
  const panelMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#1a3a8a",
        metalness: 0.6,
        roughness: 0.3,
        emissive: "#0a1a4a",
        emissiveIntensity: 0.3,
      }),
    []
  );

  return (
    <group ref={group}>
      {/* Main body - central bus */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 1.2, 1.6]} />
        <meshStandardMaterial color="#d4d4d4" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Gold thermal foil wrap */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.21, 0.6, 1.61]} />
        <meshStandardMaterial color="#d4a74a" metalness={0.95} roughness={0.15} emissive="#3a2a00" emissiveIntensity={0.2} />
      </mesh>

      {/* Solar panel arms */}
      <mesh position={[-1.6, 0, 0]}>
        <boxGeometry args={[2, 0.04, 0.04]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.6, 0, 0]}>
        <boxGeometry args={[2, 0.04, 0.04]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Solar panels - left */}
      <mesh ref={panelL} position={[-3.2, 0, 0]} material={panelMat}>
        <boxGeometry args={[2.6, 0.05, 1.4]} />
      </mesh>
      {/* panel cell lines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`l-${i}`} position={[-3.2, 0.03, -0.6 + i * 0.3]}>
          <boxGeometry args={[2.6, 0.001, 0.01]} />
          <meshBasicMaterial color="#0a1a3a" />
        </mesh>
      ))}

      {/* Solar panels - right */}
      <mesh ref={panelR} position={[3.2, 0, 0]} material={panelMat}>
        <boxGeometry args={[2.6, 0.05, 1.4]} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`r-${i}`} position={[3.2, 0.03, -0.6 + i * 0.3]}>
          <boxGeometry args={[2.6, 0.001, 0.01]} />
          <meshBasicMaterial color="#0a1a3a" />
        </mesh>
      ))}

      {/* Communication dish */}
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

      {/* Indian flag panel - tricolor on body side */}
      <group position={[0, 0, 0.81]}>
        <mesh position={[0, 0.18, 0]}>
          <planeGeometry args={[0.55, 0.18]} />
          <meshStandardMaterial color="#FF9933" emissive="#FF9933" emissiveIntensity={0.15} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.55, 0.18]} />
          <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, -0.18, 0]}>
          <planeGeometry args={[0.55, 0.18]} />
          <meshStandardMaterial color="#138808" emissive="#138808" emissiveIntensity={0.15} />
        </mesh>
        {/* Ashoka chakra dot */}
        <mesh position={[0, 0, 0.001]}>
          <ringGeometry args={[0.05, 0.07, 24]} />
          <meshBasicMaterial color="#000080" />
        </mesh>
      </group>

      {/* Lens / sensor */}
      <mesh position={[0, -0.4, 0.81]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} emissive="#003366" emissiveIntensity={0.4} />
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
  );
}

const SatelliteScene = () => {
  return (
    <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px]">
      {/* Glow backdrop */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(24,95%,55%)] via-transparent to-[hsl(145,60%,38%)] opacity-15 blur-[60px] animate-pulse-glow" />
      <div className="absolute inset-4 rounded-full border border-foreground/10" />
      <div className="absolute inset-10 rounded-full border border-foreground/5" />

      <Canvas
        camera={{ position: [0, 1.5, 6.5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.45} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-5, -3, -2]} intensity={0.4} color="#88aaff" />
        <pointLight position={[0, 0, 4]} intensity={0.6} color="#ffaa55" />

        <Stars radius={50} depth={30} count={800} factor={2} saturation={0} fade speed={0.5} />

        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.3}>
          <Satellite />
        </Float>
      </Canvas>
    </div>
  );
};

export default SatelliteScene;
