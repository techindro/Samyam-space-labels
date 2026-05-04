import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, OrbitControls } from "@react-three/drei";
import { useRef, useMemo, createContext, useContext } from "react";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";

// ---- Quality tier ----
type Quality = {
  tier: "low" | "med" | "high";
  texSize: number;       // earth texture resolution
  earthSegments: number; // sphere subdivisions
  cloudSegments: number;
  starsCount: number;
  starsCount2: number;
  dpr: [number, number];
  shadows: boolean;
};
const QualityCtx = createContext<Quality>({
  tier: "high", texSize: 2048, earthSegments: 128, cloudSegments: 96,
  starsCount: 5000, starsCount2: 1500, dpr: [1, 2], shadows: true,
});
const useQuality = () => useContext(QualityCtx);

function pickQuality(isMobile: boolean): Quality {
  // Heuristics: hardware concurrency + memory + mobile flag
  const cores = (navigator as any).hardwareConcurrency || 4;
  const mem = (navigator as any).deviceMemory || 4;
  const lowEnd = isMobile || cores <= 4 || mem <= 4;
  const midEnd = !lowEnd && (cores <= 8 || mem <= 8);

  if (lowEnd) {
    return { tier: "low", texSize: 1024, earthSegments: 64, cloudSegments: 48,
      starsCount: 1500, starsCount2: 600, dpr: [1, 1.4], shadows: false };
  }
  if (midEnd) {
    return { tier: "med", texSize: 1536, earthSegments: 96, cloudSegments: 72,
      starsCount: 3000, starsCount2: 1000, dpr: [1, 1.75], shadows: false };
  }
  return { tier: "high", texSize: 2048, earthSegments: 128, cloudSegments: 96,
    starsCount: 5000, starsCount2: 1500, dpr: [1, 2], shadows: true };
}

// Procedural Earth textures sized by quality
function useEarthTextures() {
  const q = useQuality();
  return useMemo(() => {
    const w = q.texSize;
    const h = q.texSize / 2;

    // ---- Day map ----
    const day = document.createElement("canvas");
    day.width = w;
    day.height = h;
    const dctx = day.getContext("2d")!;

    const og = dctx.createLinearGradient(0, 0, 0, h);
    og.addColorStop(0, "#06203f");
    og.addColorStop(0.3, "#0c3a6a");
    og.addColorStop(0.5, "#1466ad");
    og.addColorStop(0.7, "#0c3a6a");
    og.addColorStop(1, "#06203f");
    dctx.fillStyle = og;
    dctx.fillRect(0, 0, w, h);

    const oceanImg = dctx.getImageData(0, 0, w, h);
    for (let i = 0; i < oceanImg.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 14;
      oceanImg.data[i] = Math.max(0, Math.min(255, oceanImg.data[i] + n));
      oceanImg.data[i + 1] = Math.max(0, Math.min(255, oceanImg.data[i + 1] + n));
      oceanImg.data[i + 2] = Math.max(0, Math.min(255, oceanImg.data[i + 2] + n));
    }
    dctx.putImageData(oceanImg, 0, 0);

    const sx = w / 2048;
    const drawBlob = (cx: number, cy: number, pts: [number, number][], fill: string) => {
      cx *= sx; cy *= sx;
      dctx.fillStyle = fill;
      dctx.beginPath();
      dctx.moveTo(cx + pts[0][0] * sx, cy + pts[0][1] * sx);
      for (let i = 1; i < pts.length; i++) {
        const [x, y] = pts[i];
        const [px, py] = pts[i - 1];
        const mx = cx + ((px + x) / 2) * sx;
        const my = cy + ((py + y) / 2) * sx;
        dctx.quadraticCurveTo(cx + px * sx, cy + py * sx, mx, my);
      }
      dctx.closePath();
      dctx.fill();
    };

    const land = "#2f6b3a";
    const land2 = "#3c8348";
    const desert = "#c9a86b";
    const ice = "#e8f1f7";

    drawBlob(1140, 540, [[0,-180],[80,-150],[120,-90],[110,-10],[150,90],[110,200],[40,290],[-30,260],[-60,160],[-80,60],[-70,-40],[-40,-120]], land);
    drawBlob(1100, 360, [[0,-30],[80,-40],[140,-20],[120,30],[40,40],[-20,20],[-30,-10]], land2);
    drawBlob(1380, 360, [[0,-130],[160,-150],[300,-90],[380,-20],[340,60],[210,100],[80,60],[0,0],[-40,-60]], land);
    drawBlob(1320, 510, [[0,-50],[35,-30],[40,10],[20,55],[-10,60],[-30,20],[-30,-20]], land2);
    drawBlob(420, 360, [[0,-200],[80,-180],[150,-120],[160,-50],[120,20],[160,80],[80,140],[10,120],[-60,40],[-100,-40],[-60,-140]], land);
    drawBlob(560, 660, [[0,-130],[60,-90],[80,-20],[60,80],[20,180],[-30,200],[-40,120],[-30,20],[-40,-60]], land);
    drawBlob(1620, 720, [[0,-50],[110,-40],[150,20],[80,60],[-30,50],[-70,0]], desert);
    drawBlob(700, 200, [[0,-50],[60,-30],[60,30],[10,50],[-40,20],[-30,-30]], ice);
    dctx.fillStyle = ice;
    dctx.fillRect(0, h - 70 * sx, w, 70 * sx);
    dctx.fillRect(0, 0, w, 40 * sx);

    const landImg = dctx.getImageData(0, 0, w, h);
    for (let i = 0; i < landImg.data.length; i += 4) {
      const r = landImg.data[i], g = landImg.data[i+1], b = landImg.data[i+2];
      if (g > b - 5) {
        const n = (Math.random() - 0.5) * 22;
        landImg.data[i] = Math.max(0, Math.min(255, r + n));
        landImg.data[i+1] = Math.max(0, Math.min(255, g + n));
        landImg.data[i+2] = Math.max(0, Math.min(255, b + n));
      }
    }
    dctx.putImageData(landImg, 0, 0);

    const dayTex = new THREE.CanvasTexture(day);
    dayTex.colorSpace = THREE.SRGBColorSpace;
    dayTex.anisotropy = 8;

    // ---- Clouds ----
    const cloud = document.createElement("canvas");
    cloud.width = w;
    cloud.height = h;
    const cctx = cloud.getContext("2d")!;
    cctx.clearRect(0, 0, w, h);
    for (let i = 0; i < 260; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 30 + Math.random() * 130;
      const grd = cctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, "rgba(255,255,255,0.6)");
      grd.addColorStop(1, "rgba(255,255,255,0)");
      cctx.fillStyle = grd;
      cctx.beginPath();
      cctx.ellipse(x, y, r, r * 0.45, Math.random() * Math.PI, 0, Math.PI * 2);
      cctx.fill();
    }
    const cloudTex = new THREE.CanvasTexture(cloud);
    cloudTex.colorSpace = THREE.SRGBColorSpace;
    cloudTex.anisotropy = 8;

    // ---- Bump ----
    const bump = document.createElement("canvas");
    bump.width = w;
    bump.height = h;
    const bctx = bump.getContext("2d")!;
    bctx.drawImage(day, 0, 0);
    const bImg = bctx.getImageData(0, 0, w, h);
    for (let i = 0; i < bImg.data.length; i += 4) {
      const r = bImg.data[i], g = bImg.data[i+1], b = bImg.data[i+2];
      const isLand = g > b;
      const v = isLand ? 140 + (g - 80) : 30;
      bImg.data[i] = bImg.data[i+1] = bImg.data[i+2] = v;
    }
    bctx.putImageData(bImg, 0, 0);
    const bumpTex = new THREE.CanvasTexture(bump);
    bumpTex.anisotropy = 4;

    // ---- Specular (oceans bright, land dark) ----
    const spec = document.createElement("canvas");
    spec.width = w;
    spec.height = h;
    const sctx = spec.getContext("2d")!;
    sctx.drawImage(day, 0, 0);
    const sImg = sctx.getImageData(0, 0, w, h);
    for (let i = 0; i < sImg.data.length; i += 4) {
      const r = sImg.data[i], g = sImg.data[i+1], b = sImg.data[i+2];
      const isOcean = b > g + 10;
      const v = isOcean ? 230 : 30;
      sImg.data[i] = sImg.data[i+1] = sImg.data[i+2] = v;
    }
    sctx.putImageData(sImg, 0, 0);
    const specTex = new THREE.CanvasTexture(spec);
    specTex.anisotropy = 4;

    return { dayTex, cloudTex, bumpTex, specTex };
  }, []);
}

function Earth() {
  const ref = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const { dayTex, cloudTex, bumpTex, specTex } = useEarthTextures();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.008;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.013;
  });

  return (
    <group position={[0, 0, 0]} rotation={[0.32, 0, 0.12]}>
      {/* Atmosphere halos */}
      <mesh scale={1.16}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#3d7dff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#7fb6ff" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.028}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#bcdcff" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>

      {/* Earth */}
      <mesh ref={ref} castShadow receiveShadow>
        <sphereGeometry args={[1.6, 128, 128]} />
        <meshPhongMaterial
          map={dayTex}
          bumpMap={bumpTex}
          bumpScale={0.05}
          specularMap={specTex}
          specular={new THREE.Color("#3a6db8")}
          shininess={18}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef} scale={1.02}>
        <sphereGeometry args={[1.6, 96, 96]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.85}
          depthWrite={false}
          alphaTest={0.02}
        />
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
      orbit.current.rotation.y = t * 0.035;
      orbit.current.rotation.x = Math.sin(t * 0.025) * 0.16;
    }
    if (body.current) {
      body.current.rotation.y = Math.sin(t * 0.06) * 0.22;
      body.current.rotation.z = Math.sin(t * 0.04) * 0.07;
    }
  });

  return (
    <group ref={orbit}>
      <group ref={body} position={[2.85, 0.35, 0]} scale={0.34}>
        <mesh castShadow>
          <boxGeometry args={[1.1, 1.1, 1.5]} />
          <meshStandardMaterial color="#d9c98a" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh>
          <boxGeometry args={[1.115, 1.115, 1.515]} />
          <meshStandardMaterial color="#c79a3d" metalness={0.95} roughness={0.22} emissive="#3a2400" emissiveIntensity={0.18} transparent opacity={0.92} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.13, 0.16, 1.53]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[1.13, 0.12, 1.53]} />
          <meshStandardMaterial color="#e8e8e8" metalness={0.4} roughness={0.5} />
        </mesh>

        <mesh position={[-1.5, 0, 0]}>
          <boxGeometry args={[1.9, 0.05, 0.08]} />
          <meshStandardMaterial color="#9a9a9a" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[1.5, 0, 0]}>
          <boxGeometry args={[1.9, 0.05, 0.08]} />
          <meshStandardMaterial color="#9a9a9a" metalness={0.85} roughness={0.25} />
        </mesh>

        {[-3.1, 3.1].map((px) => (
          <group key={px} position={[px, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2.4, 0.04, 1.3]} />
              <meshStandardMaterial color="#0e2466" metalness={0.7} roughness={0.28} emissive="#06163f" emissiveIntensity={0.25} />
            </mesh>
            {Array.from({ length: 8 }).map((_, i) => (
              <mesh key={`v${i}`} position={[-1.05 + i * 0.3, 0.022, 0]}>
                <boxGeometry args={[0.005, 0.001, 1.28]} />
                <meshBasicMaterial color="#3a5cb8" />
              </mesh>
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <mesh key={`h${i}`} position={[0, 0.022, -0.5 + i * 0.33]}>
                <boxGeometry args={[2.38, 0.001, 0.005]} />
                <meshBasicMaterial color="#3a5cb8" />
              </mesh>
            ))}
          </group>
        ))}

        <group position={[0, 0.78, 0.25]} rotation={[-0.35, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
            <meshStandardMaterial color="#b5b5b5" metalness={0.9} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.32, 0]} rotation={[Math.PI, 0, 0]}>
            <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
            <meshStandardMaterial color="#ededed" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.18, 12]} />
            <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#222" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>

        <mesh position={[0.3, -0.7, -0.5]} rotation={[0.4, 0, 0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
          <meshStandardMaterial color="#ccc" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[-0.3, -0.7, -0.5]} rotation={[0.4, 0, -0.2]}>
          <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
          <meshStandardMaterial color="#ccc" metalness={0.7} roughness={0.3} />
        </mesh>

        <mesh position={[0.35, 0.55, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh position={[-0.35, 0.55, -0.7]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.5} />
        </mesh>

        <mesh position={[0, -0.35, 0.78]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.22, 32]} />
          <meshStandardMaterial color="#080808" metalness={0.95} roughness={0.08} emissive="#001a3a" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, -0.35, 0.9]}>
          <cylinderGeometry args={[0.16, 0.16, 0.02, 32]} />
          <meshStandardMaterial color="#3aa0ff" metalness={0.9} roughness={0.1} emissive="#1a4a9f" emissiveIntensity={0.6} />
        </mesh>

        <group position={[0, 0.15, 0.762]}>
          <mesh position={[0, 0.07, 0]}>
            <planeGeometry args={[0.42, 0.08]} />
            <meshStandardMaterial color="#FF9933" roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh>
            <planeGeometry args={[0.42, 0.08]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <planeGeometry args={[0.42, 0.08]} />
            <meshStandardMaterial color="#138808" roughness={0.6} metalness={0.1} />
          </mesh>
          <mesh position={[0, 0, 0.001]}>
            <ringGeometry args={[0.022, 0.032, 24]} />
            <meshBasicMaterial color="#000080" />
          </mesh>
        </group>

        <mesh position={[0.45, 0.45, 0.76]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color="#22ff66" />
        </mesh>
        <mesh position={[-0.45, 0.45, 0.76]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshBasicMaterial color="#ff3366" />
        </mesh>
      </group>
    </group>
  );
}

function OrbitRing() {
  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]}>
      <ringGeometry args={[2.78, 2.81, 192]} />
      <meshBasicMaterial color="#88c4ff" transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Slow cinematic drift + pointer parallax. Disabled while user actively controls.
function CinematicDrift({ userActive }: { userActive: React.MutableRefObject<boolean> }) {
  const { camera, pointer } = useThree();
  const base = useRef({ r: 6.4, y: 0.6 });
  const target = useRef(new THREE.Vector3(0, 0.6, 6.4));

  useFrame((state, delta) => {
    if (userActive.current) return;
    const t = state.clock.getElapsedTime();
    const a = t * 0.018; // very slow drift
    const r = base.current.r;
    // Parallax from pointer (-1..1)
    const px = pointer.x * 0.6;
    const py = pointer.y * 0.4;
    target.current.set(
      Math.sin(a) * r * 0.22 + px,
      base.current.y + Math.sin(t * 0.012) * 0.9 + py,
      Math.cos(a * 0.6) * 0.5 + r
    );
    camera.position.lerp(target.current, Math.min(1, delta * 0.6));
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const SatelliteScene = () => {
  const userActive = useRef(false);

  return (
    <div className="relative w-full max-w-[520px] aspect-square mx-auto">
      {/* Deep-space backdrop confined to scene */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0a1130_0%,#04061a_55%,transparent_78%)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(24,95%,55%)]/10 via-transparent to-[hsl(145,60%,38%)]/10 blur-[40px]" />
      </div>

      <Canvas
        camera={{ position: [0, 0.6, 6.4], fov: 42 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <CinematicDrift userActive={userActive} />
        <ambientLight intensity={0.18} />
        <directionalLight position={[6, 3, 4]} intensity={1.9} color="#fff4dc" castShadow />
        <directionalLight position={[-5, -2, -3]} intensity={0.25} color="#4a78c4" />
        <pointLight position={[0, 0, -6]} intensity={0.45} color="#3a6cff" />

        {/* Layered starfield for depth */}
        <Stars radius={120} depth={60} count={5000} factor={3.5} saturation={0} fade speed={0.1} />
        <Stars radius={50} depth={30} count={1500} factor={1.5} saturation={0} fade speed={0.25} />

        <Earth />
        <OrbitRing />
        <Float speed={0.3} rotationIntensity={0.04} floatIntensity={0.08}>
          <Satellite />
        </Float>

        {/* User controls — drag/pinch to orbit the satellite & earth */}
        <OrbitControls
          enablePan={false}
          enableZoom
          minDistance={3.5}
          maxDistance={11}
          rotateSpeed={0.55}
          zoomSpeed={0.6}
          autoRotate={false}
          onStart={() => { userActive.current = true; }}
          onEnd={() => { userActive.current = true; /* keep manual control after touch */ }}
        />
      </Canvas>

      {/* Subtle hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-white/60 pointer-events-none select-none">
        drag to orbit · scroll to zoom
      </div>
    </div>
  );
};

export default SatelliteScene;
