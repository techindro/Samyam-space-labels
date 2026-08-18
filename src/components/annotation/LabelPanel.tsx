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
    <div className="w-64 shrink-0 flex flex-col bg-[#0c0d18] border-l border-[#1e2238] overflow-y-auto text-sm shadow-xl z-10 select-none">

      {/* ── Label Classes ── */}
      <div className="px-3 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Label Classes</span>
          <button
            onClick={() => setShowAddLabel(v => !v)}
            title="Add label class"
            className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add label form */}
        {showAddLabel && (
          <div className="mb-2 p-2.5 bg-[#121424] rounded-lg border border-[#252942] space-y-2">
            <input
              autoFocus
              type="text"
              placeholder="New class name"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleAddLabel(); if (e.key === "Escape") setShowAddLabel(false); }}
              className="w-full bg-[#090a12] text-white text-xs px-2.5 py-1.5 rounded-md outline-none border border-[#2e3352] focus:border-indigo-500 placeholder:text-slate-500 font-sans"
            />
            <div className="flex flex-wrap gap-1.5 py-1">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  style={{ background: c }}
                  className={`w-5 h-5 rounded-full transition-all ${newColor === c ? "ring-2 ring-white scale-110 shadow-sm" : "opacity-70 hover:opacity-100"}`}
                />
              ))}
            </div>
            <button
              onClick={handleAddLabel}
              className="w-full text-xs py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-md transition-colors"
            >
              Add Class
            </button>
          </div>
        )}

        {/* Label list */}
        <div className="space-y-1">
          {labels.map(l => {
            const isActive = activeLabel.id === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onSelectLabel(l)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-[#181a30] text-white font-semibold border-l-2 border-indigo-400 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/30 shadow-sm"
                  style={{ background: l.color }}
                />
                <span className="truncate text-xs font-medium">{l.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[#1e2238] my-2" />

      {/* ── Annotations List ── */}
      <div className="px-3 pb-4 flex-1">
        <button
          onClick={() => setAnnExpanded(v => !v)}
          className="w-full flex items-center justify-between mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span>Annotations ({annotations.length})</span>
          <ChevronDown size={12} className={`transition-transform ${annExpanded ? "" : "-rotate-90"}`} />
        </button>

        {annExpanded && (
          <div className="space-y-1">
            {annotations.length === 0 && (
              <div className="text-slate-500 text-xs text-center py-6 border border-dashed border-[#1e2238] rounded-xl my-1">
                No labels drawn yet.<br/><span className="text-[10px] text-slate-600">Select a tool (BBox/Polygon) to draw</span>
              </div>
            )}
            {annotations.map((ann, i) => {
              const isSelected = ann.id === selectedId;
              return (
                <div
                  key={ann.id}
                  onClick={() => onSelectAnnotation(isSelected ? null : ann.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer group transition-all ${
                    isSelected
                      ? "bg-[#1f223d] text-white font-semibold border border-indigo-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <span
                    className="shrink-0 p-0.5 rounded"
                    style={{ color: ann.color }}
                  >
                    {ann.type === "bbox" ? <Square size={13} /> : <Hexagon size={13} />}
                  </span>
                  <span className="truncate text-xs flex-1">
                    <span className="text-slate-500 font-mono text-[10px] mr-1.5">#{i + 1}</span>
                    {ann.label}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteAnnotation(ann.id); }}
                    className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 hover:bg-white/10 rounded"
                    title="Delete annotation"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
