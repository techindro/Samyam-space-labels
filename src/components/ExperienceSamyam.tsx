import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const agents = [
  {
    title: "Data Annotation",
    gradient: "from-purple-300 via-violet-200 to-indigo-300",
    glowColor: "rgba(167, 139, 250, 0.4)",
    buttonBg: "bg-white/40 text-purple-700 hover:bg-white/60",
  },
  {
    title: "Model Evaluation",
    gradient: "from-orange-300 via-amber-300 to-orange-400",
    glowColor: "rgba(251, 146, 60, 0.4)",
    buttonBg: "bg-white/40 text-orange-700 hover:bg-white/60",
  },
  {
    title: "Dataset Query",
    gradient: "from-lime-300 via-green-300 to-emerald-300",
    glowColor: "rgba(134, 239, 172, 0.4)",
    buttonBg: "bg-white/40 text-green-700 hover:bg-white/60",
  },
];

const ExperienceSamyam = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-display">
            Experience Samyam
          </h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">LIVE</span>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Mandala/Lotus shape using CSS */}
              <div className="relative w-52 h-52 md:w-56 md:h-56 mb-4">
                {/* Glow */}
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-50"
                  style={{ background: agent.glowColor }}
                />
                {/* Shape */}
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" className={`[stop-color:var(--c1-${i})]`} style={{ stopColor: i === 0 ? '#d8b4fe' : i === 1 ? '#fdba74' : '#86efac' }} />
                      <stop offset="50%" className={`[stop-color:var(--c2-${i})]`} style={{ stopColor: i === 0 ? '#c4b5fd' : i === 1 ? '#fbbf24' : '#6ee7b7' }} />
                      <stop offset="100%" className={`[stop-color:var(--c3-${i})]`} style={{ stopColor: i === 0 ? '#a5b4fc' : i === 1 ? '#f97316' : '#34d399' }} />
                    </linearGradient>
                  </defs>
                  {/* Lotus/mandala path */}
                  <path
                    d="M100 8 C112 8, 130 30, 140 40 C150 30, 175 20, 185 35 C195 50, 175 65, 170 75 C185 80, 200 95, 195 110 C190 125, 170 125, 160 122 C165 135, 165 160, 150 168 C135 176, 120 160, 115 150 C110 165, 105 190, 90 192 C75 194, 72 170, 75 155 C65 165, 42 175, 30 165 C18 155, 30 135, 38 125 C22 128, 5 120, 5 105 C5 90, 22 82, 32 78 C20 70, 8 50, 18 38 C28 26, 48 35, 58 42 C55 30, 65 8, 80 8 C90 8, 95 15, 100 8 Z"
                    fill={`url(#grad-${i})`}
                    opacity="0.9"
                  />
                </svg>

                {/* Button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm transition-all shadow-md ${agent.buttonBg}`}>
                    <Mic className="h-4 w-4" />
                    Start Speaking
                  </button>
                </div>
              </div>

              {/* Label */}
              <span className="text-base font-medium text-foreground">{agent.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSamyam;
