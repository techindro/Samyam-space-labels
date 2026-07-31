import { useState } from "react";
import { Plus, Square, Hexagon, Tag, Trash2, ChevronDown } from "lucide-react";
import type { Annotation, LabelClass } from "./useAnnotationState";
import { PRESET_COLORS } from "./useAnnotationState";

interface Props {
  labels: LabelClass[];
  activeLabel: LabelClass;
  annotations: Annotation[];
  selectedId: string | null;
  onSelectLabel: (l: LabelClass) => void;
  onAddLabel: (name: string, color: string) => void;
  onSelectAnnotation: (id: string | null) => void;
  onDeleteAnnotation: (id: string) => void;
}

export default function LabelPanel({
  labels, activeLabel, annotations, selectedId,
  onSelectLabel, onAddLabel, onSelectAnnotation, onDeleteAnnotation,
}: Props) {
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [newName,      setNewName]      = useState("");
  const [newColor,     setNewColor]     = useState(PRESET_COLORS[0]);
  const [annExpanded,  setAnnExpanded]  = useState(true);

  const handleAddLabel = () => {
    if (!newName.trim()) return;
    onAddLabel(newName.trim(), newColor);
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
    setShowAddLabel(false);
  };

  return (
    <div className="w-60 shrink-0 flex flex-col bg-[#0c0c1b]/95 backdrop-blur-md border-l border-white/10 overflow-y-auto text-sm shadow-xl z-10 select-none">

      {/* ── Label Classes ── */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-white/40">Labels</span>
          <button
            onClick={() => setShowAddLabel(v => !v)}
            title="Add label class"
            className="w-6 h-6 flex items-center justify-center rounded-md text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add label form */}
        {showAddLabel && (
          <div className="mb-2 p-2 bg-white/5 rounded-lg space-y-2">
            <input
              autoFocus
              type="text"
              placeholder="Label name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAddLabel(); if (e.key === "Escape") setShowAddLabel(false); }}
              className="w-full bg-white/10 text-white text-xs px-2 py-1.5 rounded-md outline-none border border-white/10 focus:border-cosmic-purple/60 placeholder:text-white/30"
            />
            <div className="flex flex-wrap gap-1">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  style={{ background: c }}
                  className={`w-5 h-5 rounded-full transition-transform ${newColor === c ? "ring-2 ring-white scale-110" : "opacity-70 hover:opacity-100"}`}
                />
              ))}
            </div>
            <button
              onClick={handleAddLabel}
              className="w-full text-xs py-1 bg-cosmic-purple/80 hover:bg-cosmic-purple text-white rounded-md transition-colors"
            >
              Add
            </button>
          </div>
        )}

        {/* Label list */}
        <div className="space-y-0.5">
          {labels.map(l => (
            <button
              key={l.id}
              onClick={() => onSelectLabel(l)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors ${
                activeLabel.id === l.id ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/20"
                style={{ background: l.color }}
              />
              <span className="truncate text-xs">{l.name}</span>
              {activeLabel.id === l.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cosmic-teal shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-white/10 my-1" />

      {/* ── Annotations List ── */}
      <div className="px-3 pb-4 flex-1">
        <button
          onClick={() => setAnnExpanded(v => !v)}
          className="w-full flex items-center justify-between mb-2 text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors"
        >
          <span>Annotations ({annotations.length})</span>
          <ChevronDown size={12} className={`transition-transform ${annExpanded ? "" : "-rotate-90"}`} />
        </button>

        {annExpanded && (
          <div className="space-y-0.5">
            {annotations.length === 0 && (
              <p className="text-white/25 text-xs text-center py-4">No annotations yet.<br/>Start drawing!</p>
            )}
            {annotations.map((ann, i) => (
              <div
                key={ann.id}
                onClick={() => onSelectAnnotation(ann.id === selectedId ? null : ann.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer group transition-colors ${
                  ann.id === selectedId ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className="shrink-0"
                  style={{ color: ann.color }}
                >
                  {ann.type === "bbox" ? <Square size={12} /> : <Hexagon size={12} />}
                </span>
                <span className="truncate text-xs flex-1">
                  <span className="text-white/30 mr-1">#{i + 1}</span>
                  {ann.label}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); onDeleteAnnotation(ann.id); }}
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition-all"
                  title="Delete annotation"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
