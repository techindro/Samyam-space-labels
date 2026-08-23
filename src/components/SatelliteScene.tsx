import React, { useRef, useMemo, createContext, useContext, useState, useEffect, Component, ReactNode, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useIsMobile } from "@/hooks/use-mobile";
import { Zap, Battery } from "lucide-react";
import earthMapUrl from "@/assets/earth-map.jpg";
import heroOrbUrl from "@/assets/hero-orb.jpg";

// WebGL Support Check
function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!(window.WebGLRenderingContext && gl);
  } catch (e) {
    return false;
  }
}

// WebGL Fallback Error Boundary
class WebGLBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.warn("WebGL Context error caught in SatelliteScene, rendering 2D fallback:", err);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

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

function pickQuality(isMobile: boolean, mode: "auto" | "high" | "saver" = "auto"): Quality {
  if (mode === "saver") {
    return { tier: "low", texSize: 1024, earthSegments: 64, cloudSegments: 48,
      starsCount: 800, starsCount2: 300, dpr: [1, 1.25], shadows: false };
  }
  if (mode === "high") {
    return { tier: "high", texSize: 2048, earthSegments: 128, cloudSegments: 96,
      starsCount: 5000, starsCount2: 1500, dpr: [1, 2], shadows: true };
  }
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
    try {
      const w = q.texSize;
      const h = q.texSize / 2;

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

      const land = "#2f6b3a";
      const land2 = "#3c8348";
      const desert = "#c9a86b";
      const ice = "#e8f1f7";

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

      drawBlob(1140, 540, [[0,-180],[80,-150],[120,-90],[110,-10],[150,90],[110,200],[40,290],[-30,260],[-60,160],[-80,60],[-70,-40],[-40,-120]], land);
      drawBlob(1100, 360, [[0,-30],[80,-40],[140,-20],[120,30],[40,40],[-20,20],[-30,-10]], land2);
      drawBlob(1380, 360, [[0,-130],[160,-150],[300,-90],[380,-20],[340,60],[210,100],[80,60],[0,0],[-40,-60]], land);
      drawBlob(420, 360, [[0,-200],[80,-180],[150,-120],[160,-50],[120,20],[160,80],[80,140],[10,120],[-60,40],[-100,-40],[-60,-140]], land);
      drawBlob(1620, 720, [[0,-50],[110,-40],[150,20],[80,60],[-30,50],[-70,0]], desert);
      drawBlob(700, 200, [[0,-50],[60,-30],[60,30],[10,50],[-40,20],[-30,-30]], ice);

      const dayTex = new THREE.CanvasTexture(day);
      dayTex.colorSpace = THREE.SRGBColorSpace;
      dayTex.anisotropy = 8;

      // Clouds
      const cloud = document.createElement("canvas");
      cloud.width = w;
      cloud.height = h;
      const cctx = cloud.getContext("2d")!;
      cctx.clearRect(0, 0, w, h);
      const cloudCount = q.tier === "low" ? 90 : 180;
      for (let i = 0; i < cloudCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 30 + Math.random() * 120;
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

      const bumpTex = dayTex;
      const specTex = dayTex;

      return { dayTex, cloudTex, bumpTex, specTex };
    } catch (e) {
      return { dayTex: new THREE.Texture(), cloudTex: new THREE.Texture(), bumpTex: new THREE.Texture(), specTex: new THREE.Texture() };
    }
  }, [q.texSize, q.tier]);
}

function Earth() {
  const ref = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const { cloudTex, bumpTex, specTex } = useEarthTextures();
  const dayTex = useTexture(earthMapUrl);
  useMemo(() => {
    if (dayTex) {
      dayTex.colorSpace = THREE.SRGBColorSpace;
      dayTex.anisotropy = 8;
      dayTex.wrapS = THREE.RepeatWrapping;
    }
  }, [dayTex]);
  const q = useQuality();
  const haloSeg = q.tier === "low" ? 32 : 64;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.008;
    if (cloudsRef.current) cloudsRef.current.rotation.y = t * 0.013;
  });

  return (
    <group position={[0, 0, 0]} rotation={[0.32, 0, 0.12]}>
      <mesh scale={1.16}>
        <sphereGeometry args={[1.6, haloSeg, haloSeg]} />
        <meshBasicMaterial color="#3d7dff" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1.6, haloSeg, haloSeg]} />
        <meshBasicMaterial color="#7fb6ff" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>

      <mesh ref={ref} castShadow={q.shadows} receiveShadow={q.shadows}>
        <sphereGeometry args={[1.6, q.earthSegments, q.earthSegments]} />
        <meshPhongMaterial
          map={dayTex}
          bumpMap={bumpTex}
          bumpScale={0.04}
          specularMap={specTex}
          specular={new THREE.Color("#3a6db8")}
          shininess={20}
        />
      </mesh>

      <mesh ref={cloudsRef} scale={1.02}>
        <sphereGeometry args={[1.6, q.cloudSegments, q.cloudSegments]} />
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
      orbit.current.rotation.y = t * 0.18;
      orbit.current.rotation.x = Math.sin(t * 0.08) * 0.18;
    }
    if (body.current) {
      body.current.rotation.y = Math.sin(t * 0.25) * 0.25;
      body.current.rotation.z = Math.sin(t * 0.18) * 0.08;
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
  const q = useQuality();
  const seg = q.tier === "low" ? 96 : q.tier === "med" ? 144 : 192;
  return (
    <mesh rotation={[Math.PI / 2.2, 0, 0]}>
      <ringGeometry args={[2.78, 2.81, seg]} />
      <meshBasicMaterial color="#88c4ff" transparent opacity={0.12} side={THREE.DoubleSide} />
    </mesh>
  );
}

function CinematicDrift({ userActive }: { userActive: React.MutableRefObject<boolean> }) {
  const { camera, pointer } = useThree();
  const base = useRef({ r: 6.4, y: 0.6 });
  const target = useRef(new THREE.Vector3(0, 0.6, 6.4));

  useFrame((state, delta) => {
    if (userActive.current) return;
    const t = state.clock.getElapsedTime();
    const a = t * 0.018;
    const r = base.current.r;
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

// Adaptive DPR: drop pixel ratio if FPS dips, raise it back if smooth
function AdaptivePerf() {
  const { gl } = useThree();
  const fps = useRef({ frames: 0, last: performance.now(), dpr: 0 });
  useFrame(() => {
    fps.current.frames++;
    const now = performance.now();
    if (now - fps.current.last >= 1000) {
      const f = fps.current.frames;
      fps.current.frames = 0;
      fps.current.last = now;
      const cur = gl.getPixelRatio();
      if (f < 40 && cur > 1) gl.setPixelRatio(Math.max(1, cur - 0.25));
      else if (f > 55 && cur < Math.min(window.devicePixelRatio, 2)) {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2, cur + 0.25));
      }
    }
  });
  return null;
}

const SceneContents = () => {
  const q = useQuality();
  const userActive = useRef(false);
  return (
    <>
      <CinematicDrift userActive={userActive} />
      <AdaptivePerf />
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 3, 4]} intensity={1.6} color="#fff4dc" castShadow={q.shadows} />
      <directionalLight position={[-5, -2, -3]} intensity={0.7} color="#88aaff" />
      <pointLight position={[0, 0, -6]} intensity={0.5} color="#3a6cff" />

      <Stars radius={120} depth={60} count={q.starsCount} factor={3.5} saturation={0} fade speed={0.1} />
      <Stars radius={50} depth={30} count={q.starsCount2} factor={1.5} saturation={0} fade speed={0.25} />

      <Earth />
      <OrbitRing />
      <Float speed={0.3} rotationIntensity={0.04} floatIntensity={0.08}>
        <Satellite />
      </Float>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.5}
        autoRotate={false}
        onStart={() => { userActive.current = true; }}
        onEnd={() => { userActive.current = true; }}
      />
    </>
  );
};

type Mode = "auto" | "high" | "saver";

// 2D Earth Orb Fallback when WebGL context fails
const OrbFallback2D = () => (
  <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto flex items-center justify-center">
    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cosmic-purple/20 via-cosmic-teal/15 to-transparent blur-2xl animate-pulse" />
    <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_0_50px_rgba(139,92,246,0.3)] group">
      <img
        src={heroOrbUrl}
        alt="Earth Orb"
        className="w-full h-full object-cover rounded-full animate-spin"
        style={{ animationDuration: "60s" }}
      />
      {/* Orbital Ring overlay */}
      <div className="absolute inset-0 border border-white/30 rounded-full pointer-events-none transform rotate-[25deg] scale-110" />
    </div>
  </div>
);

const SatelliteScene = () => {
  const isMobile = useIsMobile();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    // Avoid preemptive execution that might fail on fingerprint-protected browsers due to dummy canvas context limit.
    // WebGLBoundary will automatically handle real rendering errors at runtime.
    try {
      const isSupported = checkWebGLSupport();
      if (!isSupported) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window === "undefined") return "auto";
    return (localStorage.getItem("satellite-quality") as Mode) || "auto";
  });

  const quality = useMemo(() => pickQuality(!!isMobile, mode), [isMobile, mode]);
  const isSaver = mode === "saver" || (mode === "auto" && quality.tier === "low");

  if (!hasWebGL) {
    return <OrbFallback2D />;
  }

  return (
    <div className="relative w-full max-w-[520px] aspect-square mx-auto">
      {/* Soft ambient glow only — no dark blackout circle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(24,95%,55%)]/10 via-transparent to-[hsl(145,60%,38%)]/10 blur-[40px]" />
      </div>

      <WebGLBoundary fallback={<OrbFallback2D />}>
        <Canvas
          key={`${quality.tier}-${quality.texSize}`}
          camera={{ position: [0, 0.6, 7.4], fov: 40 }}
          dpr={quality.dpr}
          gl={{ antialias: quality.tier !== "low", alpha: true, powerPreference: "high-performance" }}
          shadows={quality.shadows}
          style={{ background: "transparent" }}
        >
          <QualityCtx.Provider value={quality}>
            <Suspense fallback={null}>
              <SceneContents />
            </Suspense>
          </QualityCtx.Provider>
        </Canvas>
      </WebGLBoundary>

      {/* Quality toggle */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/30 backdrop-blur-md p-1 text-[11px]">
        <button
          onClick={() => setMode("high")}
          className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${!isSaver ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}
          title="High quality"
        >
          <Zap className="h-3 w-3" /> High
        </button>
        <button
          onClick={() => setMode("saver")}
          className={`flex items-center gap-1 px-2 py-1 rounded-full transition ${isSaver ? "bg-white/15 text-white" : "text-white/60 hover:text-white"}`}
          title="Battery saver"
        >
          <Battery className="h-3 w-3" /> Saver
        </button>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] tracking-wide text-white/60 pointer-events-none select-none">
        drag to orbit
      </div>
    </div>
  );
};

export default SatelliteScene;
