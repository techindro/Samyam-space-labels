import { AudioLines, FileText, Check, X, Sparkle } from "lucide-react";

export type LabelSuggestion = {
  id: string;
  label: string;
  confidence: number;
  accepted: boolean;
};

export type DatasetItem = {
  id: string;
  name: string;
  kind: "image" | "audio" | "text";
  url?: string;
  sizeLabel?: string;
  meta?: string;
  waveform?: number[];
  caption?: string;
  suggestions: LabelSuggestion[];
};

/** Deterministic pseudo-random from a string so previews stay stable. */
export function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function makeWaveform(name: string, bars = 44) {
  const seed = hashSeed(name);
  return Array.from({ length: bars }, (_, i) => {
    const v = Math.sin((seed % 97) + i * 0.7) * Math.cos(i * 0.31 + (seed % 13));
    return 0.25 + Math.abs(v) * 0.75;
  });
}

const IMAGE_SUGGESTIONS = ["building", "road", "water", "vegetation", "vehicle", "cloud cover"];
const AUDIO_SUGGESTIONS = ["mission-status", "telemetry-check", "speaker-turn", "ground-station"];
const TEXT_SUGGESTIONS = ["class_name", "geo_bounds", "capture_time", "sensor_id"];

export function suggestionsFor(kind: DatasetItem["kind"], name: string): LabelSuggestion[] {
  const pool = kind === "image" ? IMAGE_SUGGESTIONS : kind === "audio" ? AUDIO_SUGGESTIONS : TEXT_SUGGESTIONS;
  const seed = hashSeed(name);
  return pool
    .filter((_, i) => (seed >> i) % 3 !== 0)
    .slice(0, 4)
    .map((label, i) => ({
      id: `${name}-${label}`,
      label,
      confidence: Math.min(0.98, 0.72 + (((seed >> (i + 2)) % 26) / 100)),
      accepted: i === 0,
    }));
}

export function captionFor(item: DatasetItem) {
  if (item.caption) return item.caption;
  if (item.kind === "audio") return "Auto-transcript: \u201cStation copy, telemetry nominal, begin labeling pass.\u201d";
  if (item.kind === "text") return "Preview: header row detected \u00b7 candidate label column highlighted.";
  return "Preview tile ready \u00b7 pre-labels generated at 1024px.";
}

interface Props {
  item: DatasetItem;
  onToggleSuggestion?: (itemId: string, suggestionId: string) => void;
  onRemove?: (itemId: string) => void;
  compact?: boolean;
}

export default function DatasetItemCard({ item, onToggleSuggestion, onRemove, compact }: Props) {
  const accepted = item.suggestions.filter((s) => s.accepted).length;

  return (
    <div className="w-full rounded-xl border border-border bg-muted/30 p-3 text-left">
      <div className="flex items-start gap-3">
        {/* Thumbnail / waveform / doc glyph */}
        {item.kind === "image" && item.url ? (
          <img
            src={item.url}
            alt={`Preview of ${item.name}`}
            loading="lazy"
            className="h-16 w-16 shrink-0 rounded-lg border border-border object-cover"
          />
        ) : item.kind === "audio" ? (
          <div className="flex h-16 w-24 shrink-0 items-end gap-[2px] rounded-lg border border-border bg-background/60 px-2 py-2">
            {(item.waveform ?? makeWaveform(item.name)).slice(0, 18).map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-full bg-primary/70"
                style={{ height: `${Math.round(h * 100)}%` }}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {item.kind === "audio" && <AudioLines className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
            <p className="truncate text-sm font-medium">{item.name}</p>
            {onRemove && (
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                onClick={() => onRemove(item.id)}
                className="ml-auto text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {[item.kind, item.sizeLabel, item.meta].filter(Boolean).join(" \u00b7 ")}
          </p>
          {!compact && (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
              {captionFor(item)}
            </p>
          )}
        </div>
      </div>

      {/* Per-item labeling suggestions */}
      <div className="mt-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          <Sparkle className="h-3 w-3" />
          Suggested labels
          <span className="ml-auto font-mono normal-case tracking-normal">
            {accepted}/{item.suggestions.length} accepted
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {item.suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              disabled={!onToggleSuggestion}
              aria-pressed={s.accepted}
              onClick={() => onToggleSuggestion?.(item.id, s.id)}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] transition-colors ${
                s.accepted
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border bg-background/60 text-muted-foreground hover:text-foreground"
              } ${onToggleSuggestion ? "cursor-pointer" : "cursor-default"}`}
            >
              {s.accepted && <Check className="h-3 w-3" />}
              <span>{s.label}</span>
              <span className="font-mono opacity-60">{s.confidence.toFixed(2)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
