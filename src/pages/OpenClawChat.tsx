import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  AudioLines,
  FileText,
  X,
  Radio,
  Layers,
  Activity,
  Bot,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import DatasetItemCard, {
  makeWaveform,
  suggestionsFor,
  type DatasetItem,
} from "@/components/openclaw/DatasetItemCard";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type Attachment = DatasetItem;

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  attachments?: Attachment[];
  streaming?: boolean;
};

const GATEWAY_LABEL = "gateway.openclaw.samyam.dev";

const sessions = [
  { name: "Sentinel-2 flood masks", status: "Labeling", progress: 68, items: "4,210 tiles" },
  { name: "SAR vessel detection", status: "QA review", progress: 91, items: "1,880 chips" },
  { name: "Hyperspectral crop health", status: "Ingesting", progress: 22, items: "310 cubes" },
  { name: "Chandrayaan-2 crater set", status: "Labeling", progress: 45, items: "980 frames" },
];

const pipelines = [
  { name: "eo-autolabel-v3", state: "running" },
  { name: "sar-change-detect", state: "running" },
  { name: "fusion-track-align", state: "queued" },
];

function kindOf(file: File): Attachment["kind"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  return "text";
}

function simulatedReply(text: string, attachments: Attachment[]) {
  const acceptedLabels = Array.from(
    new Set(attachments.flatMap((a) => a.suggestions.filter((s) => s.accepted).map((s) => s.label)))
  );
  const schemaLine = acceptedLabels.length
    ? `\n\n**Confirmed schema from your selections**: ${acceptedLabels.map((l) => `\`${l}\``).join(", ")}`
    : "";
  const img = attachments.filter((a) => a.kind === "image").length;
  const aud = attachments.filter((a) => a.kind === "audio").length;
  const txt = attachments.filter((a) => a.kind === "text").length;

  if (img) {
    return `Received ${img} image${img > 1 ? "s" : ""}. Running the multimodal labeling pass:

**Detected objects**
- Built-up structures — 34 instances (mean conf. 0.91)
- Road segments — 12 polylines (mean conf. 0.87)
- Water body — 1 polygon, 4.2 km² (conf. 0.95)
- Vegetation patches — 9 masks (mean conf. 0.83)

**Suggested schema**: \`building\`, \`road\`, \`water\`, \`vegetation\`
**Quality gate**: mean IoU 0.84 against the reference tiles — above the 0.80 acceptance threshold.

I can export this as COCO, GeoJSON or YOLO, or push it into an active labeling session for human review.${schemaLine}`;
  }
  if (aud) {
    return `Processing ${aud} audio file${aud > 1 ? "s" : ""} through the speech pipeline (en-IN / hi-IN acoustic models):

- Transcription complete — 3 speaker turns, 42s duration
- Intent tags: \`mission-status\`, \`telemetry-check\`
- Named entities: 2 satellite IDs, 1 ground station

Timestamps are aligned to the transcript so the audio can be cross-labeled with telemetry frames for sensor-fusion training sets.${schemaLine}`;
  }
  if (txt) {
    return `Parsed ${txt} dataset file${txt > 1 ? "s" : ""}.

- Rows detected: 12,480 · Columns: 9
- Candidate label column: \`class_name\` (7 unique classes)
- Class imbalance flagged: \`debris\` at 2.1% of rows

Recommendation: stratified sampling plus targeted labeling of the minority class before the next training run.${schemaLine}`;
  }

  return `On it — "${text.slice(0, 80)}".

samyam's labeling engine can handle this across modalities: optical imagery, SAR, hyperspectral cubes and fused sensor streams. Typical flow is ingest → AI-assisted pre-labels → human review → IoU/mAP quality gates → export.

Attach an image, an audio clip or a dataset file and I'll run a simulated labeling pass over it.`;
}

const OpenClawChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Connected to the OpenClaw gateway. Drop in satellite imagery, audio or a dataset file and I'll walk you through a labeling pass.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState<Attachment[]>([]);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = Array.from(files).slice(0, 5).map((f) => {
      const kind = kindOf(f);
      return {
        id: crypto.randomUUID(),
        name: f.name,
        kind,
        url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
        sizeLabel: sizeLabel(f.size),
        meta: kind === "image" ? "optical tile" : kind === "audio" ? "voice / telemetry" : "tabular dataset",
        waveform: kind === "audio" ? makeWaveform(f.name) : undefined,
        suggestions: suggestionsFor(kind, f.name),
      };
    });
    setPending((p) => [...p, ...next]);
  };

  const toggleSuggestion = (itemId: string, suggestionId: string) => {
    setPending((p) =>
      p.map((a) =>
        a.id !== itemId
          ? a
          : {
              ...a,
              suggestions: a.suggestions.map((s) =>
                s.id === suggestionId ? { ...s, accepted: !s.accepted } : s
              ),
            }
      )
    );
  };

  const send = () => {
    const text = input.trim();
    if ((!text && pending.length === 0) || busy) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      attachments: pending,
    };
    const replyId = crypto.randomUUID();
    const full = simulatedReply(text, pending);

    setMessages((m) => [...m, userMsg, { id: replyId, role: "assistant", text: "", streaming: true }]);
    setInput("");
    setPending([]);
    setBusy(true);

    let i = 0;
    const step = () => {
      i += Math.max(2, Math.round(full.length / 260));
      const slice = full.slice(0, i);
      setMessages((m) => m.map((msg) => (msg.id === replyId ? { ...msg, text: slice } : msg)));
      if (i < full.length) {
        window.setTimeout(step, 18);
      } else {
        setMessages((m) => m.map((msg) => (msg.id === replyId ? { ...msg, streaming: false } : msg)));
        setBusy(false);
        textRef.current?.focus();
      }
    };
    window.setTimeout(step, 550);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <ParallelWebBg />

      <main className="relative z-10 container mx-auto px-4 pt-28 pb-16">
        <section data-reveal="off" className="mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">OpenClaw Chat</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Multimodal labeling assistant for satellite, sensor and document data.
              </p>
            </div>
            <div className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <Radio className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Connected via Gateway:</span>
              <span className="font-mono">{GATEWAY_LABEL}</span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chat column */}
          <section data-reveal="off" className="glass-card rounded-2xl flex flex-col overflow-hidden min-h-[60vh] lg:h-[70vh]">
            <ScrollArea className="flex-1 p-4 sm:p-6">
              <div className="space-y-5">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.role === "assistant" && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${m.role === "user" ? "text-right" : ""}`}>
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="mb-2 grid gap-2 sm:grid-cols-2">
                          {m.attachments.map((a) => (
                            <DatasetItemCard key={a.id} item={a} compact />
                          ))}
                        </div>
                      )}
                      {(m.text || m.streaming) && (
                        <div
                          className={
                            m.role === "user"
                              ? "inline-block rounded-2xl bg-primary px-4 py-2.5 text-left text-sm text-primary-foreground"
                              : "text-sm leading-relaxed whitespace-pre-wrap"
                          }
                        >
                          {m.text}
                          {m.streaming && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-foreground align-middle" />}
                        </div>
                      )}
                    </div>
                    {m.role === "user" && (
                      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>
                ))}
                <div ref={bottomRef} />
              </div>
            </ScrollArea>

            <div className="border-t border-border p-3 sm:p-4">
              {pending.length > 0 && (
                <div className="mb-3 grid gap-2 sm:grid-cols-2">
                  {pending.map((a) => (
                    <DatasetItemCard
                      key={a.id}
                      item={a}
                      onToggleSuggestion={toggleSuggestion}
                      onRemove={(id) => setPending((p) => p.filter((x) => x.id !== id))}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-end gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*,audio/*,.csv,.json,.txt,.jsonl,.geojson"
                  className="hidden"
                  onChange={(e) => {
                    addFiles(e.target.files);
                    e.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Attach files"
                  onClick={() => fileRef.current?.click()}
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  ref={textRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Ask about a dataset, or attach imagery / audio / CSV…"
                  className="min-h-[44px] max-h-40 resize-none"
                />
                <Button type="button" size="icon" aria-label="Send message" onClick={send} disabled={busy}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Running on a temporary gateway token — responses are simulated for demonstration.
              </p>
            </div>
          </section>

          {/* Side panel */}
          <aside data-reveal="off" className="space-y-6">
            <div className="glass-card rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Recent Labeling Sessions</h2>
              </div>
              <ul className="space-y-3">
                {sessions.map((s) => (
                  <li key={s.name} className="rounded-xl border border-border/60 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{s.name}</p>
                      <Badge variant="secondary" className="shrink-0 text-[10px]">
                        {s.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.items}</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${s.progress}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold">Active Pipelines</h2>
              </div>
              <ul className="space-y-2">
                {pipelines.map((p) => (
                  <li key={p.name} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs">{p.name}</span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs ${
                        p.state === "running" ? "text-emerald-600" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          p.state === "running" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
                        }`}
                      />
                      {p.state}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OpenClawChat;
