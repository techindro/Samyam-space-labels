import { useState, useMemo, useEffect } from "react";
import { 
  Plus, Square, Hexagon, Trash2, ChevronDown, RotateCw, 
  Search, Eye, EyeOff, Lock, Unlock, X, Layers, Tag, AlertTriangle
} from "lucide-react";
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
  onToggleHideAnnotation?: (id: string) => void;
  onToggleLockAnnotation?: (id: string) => void;
  onToggleHideClass?: (className: string) => void;
  onClearAllAnnotations?: () => void;
}

export default function LabelPanel({
  labels,
  activeLabel,
  annotations,
  selectedId,
  onSelectLabel,
  onAddLabel,
  onSelectAnnotation,
  onDeleteAnnotation,
  onToggleHideAnnotation,
  onToggleLockAnnotation,
  onToggleHideClass,
  onClearAllAnnotations,
}: Props) {
  const [showAddLabel, setShowAddLabel] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0]);
  const [annExpanded, setAnnExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Keyboard shortcut listener: Keys 1 to 9 switch active class
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= Math.min(9, labels.length)) {
        onSelectLabel(labels[num - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [labels, onSelectLabel]);

  // Compute annotation count per label class
  const classCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ann of annotations) {
      counts[ann.label] = (counts[ann.label] || 0) + 1;
    }
    return counts;
  }, [annotations]);

  // Filtered labels
  const filteredLabels = useMemo(() => {
    if (!searchQuery.trim()) return labels;
    const q = searchQuery.toLowerCase();
    return labels.filter(l => l.name.toLowerCase().includes(q));
  }, [labels, searchQuery]);

  // Filtered annotations
  const filteredAnnotations = useMemo(() => {
    if (!searchQuery.trim()) return annotations;
    const q = searchQuery.toLowerCase();
    return annotations.filter((ann, idx) => 
      ann.label.toLowerCase().includes(q) || 
      `#${idx + 1}`.includes(q) ||
      ann.type.toLowerCase().includes(q)
    );
  }, [annotations, searchQuery]);

  const handleAddLabel = () => {
    if (!newName.trim()) return;
    onAddLabel(newName.trim(), newColor);
    setNewName("");
    setNewColor(PRESET_COLORS[0]);
    setShowAddLabel(false);
  };

  return (
    <div className="w-72 shrink-0 flex flex-col bg-[#0c0d18] border-l border-[#1e2238] overflow-y-auto text-sm shadow-xl z-10 select-none">
      
      {/* ── Search Bar ── */}
      <div className="p-3 border-b border-[#1e2238]/80 bg-[#090a14]">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-2.5 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search classes or labels..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-[#121424] text-white text-xs pl-8 pr-7 py-1.5 rounded-lg outline-none border border-[#252942] focus:border-indigo-500 placeholder:text-slate-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 text-slate-500 hover:text-white p-0.5"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ── Label Classes Header ── */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Tag size={12} className="text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Classes ({labels.length})
            </span>
          </div>
          <button
            onClick={() => setShowAddLabel(v => !v)}
            title="Add new label class"
            className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Add label form */}
        {showAddLabel && (
          <div className="mb-2.5 p-2.5 bg-[#121424] rounded-lg border border-[#252942] space-y-2 animate-in fade-in duration-150">
            <input
              autoFocus
              type="text"
              placeholder="New class name (e.g. Solar Wing)"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") handleAddLabel();
                if (e.key === "Escape") setShowAddLabel(false);
              }}
              className="w-full bg-[#090a12] text-white text-xs px-2.5 py-1.5 rounded-md outline-none border border-[#2e3352] focus:border-indigo-500 placeholder:text-slate-500 font-sans"
            />
            <div className="flex flex-wrap gap-1.5 py-1">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  style={{ background: c }}
                  className={`w-5 h-5 rounded-full transition-all ${
                    newColor === c ? "ring-2 ring-white scale-110 shadow-sm" : "opacity-70 hover:opacity-100"
                  }`}
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
          {filteredLabels.length === 0 && (
            <div className="text-slate-500 text-[11px] py-2 text-center">
              No matching classes
            </div>
          )}
          {filteredLabels.map((l, index) => {
            const isActive = activeLabel.id === l.id;
            const count = classCounts[l.name] || 0;
            const hotkeyIndex = index < 9 ? index + 1 : null;
            
            // Check if all annotations of this class are hidden
            const classAnns = annotations.filter(a => a.label === l.name);
            const isClassHidden = classAnns.length > 0 && classAnns.every(a => a.hidden);

            return (
              <div
                key={l.id}
                onClick={() => onSelectLabel(l)}
                className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#181a30] text-white font-semibold border-l-2 border-indigo-400 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/30 shadow-sm"
                    style={{ background: l.color }}
                  />
                  <span className="truncate text-xs font-medium">{l.name}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Instance count badge */}
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                    count > 0 
                      ? "bg-indigo-500/20 text-indigo-300 font-bold" 
                      : "text-slate-600 bg-white/5"
                  }`}>
                    {count}
                  </span>

                  {/* Hotkey badge */}
                  {hotkeyIndex && (
                    <kbd className="hidden sm:inline-block text-[9px] px-1 py-0.2 bg-[#121424] border border-[#2e3352] text-slate-500 rounded font-mono">
                      {hotkeyIndex}
                    </kbd>
                  )}

                  {/* Class visibility toggle */}
                  {onToggleHideClass && count > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleHideClass(l.name);
                      }}
                      title={isClassHidden ? "Show all in this class" : "Hide all in this class"}
                      className={`p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity ${
                        isClassHidden ? "text-amber-400 opacity-100" : "text-slate-500 hover:text-white"
                      }`}
                    >
                      {isClassHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-[#1e2238] my-2" />

      {/* ── Annotations List ── */}
      <div className="px-3 pb-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setAnnExpanded(v => !v)}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Layers size={11} className="text-violet-400" />
            <span>Annotations ({annotations.length})</span>
            <ChevronDown size={12} className={`transition-transform ${annExpanded ? "" : "-rotate-90"}`} />
          </button>

          {/* Clear all annotations button */}
          {annotations.length > 0 && onClearAllAnnotations && (
            <button
              onClick={() => setShowConfirmClear(true)}
              title="Clear all annotations"
              className="text-[10px] text-slate-500 hover:text-red-400 flex items-center gap-1 hover:bg-white/5 px-1.5 py-0.5 rounded transition-colors"
            >
              <Trash2 size={11} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Clear Confirmation Banner */}
        {showConfirmClear && (
          <div className="mb-2 p-2 bg-red-950/40 border border-red-500/30 rounded-lg text-xs space-y-2">
            <div className="flex items-center gap-1.5 text-red-300 font-medium text-[11px]">
              <AlertTriangle size={13} className="shrink-0 text-red-400" />
              <span>Delete all {annotations.length} annotations?</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onClearAllAnnotations?.();
                  setShowConfirmClear(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-1 rounded text-[11px] transition-colors"
              >
                Yes, Clear All
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-1 rounded text-[11px] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {annExpanded && (
          <div className="space-y-1">
            {annotations.length === 0 && (
              <div className="text-slate-500 text-xs text-center py-6 border border-dashed border-[#1e2238] rounded-xl my-1">
                No labels drawn yet.<br />
                <span className="text-[10px] text-slate-600">Select a tool (BBox/Polygon/OBB) to draw</span>
              </div>
            )}

            {filteredAnnotations.map((ann, i) => {
              const isSelected = ann.id === selectedId;
              const isHidden = ann.hidden;
              const isLocked = ann.locked;

              return (
                <div
                  key={ann.id}
                  onClick={() => onSelectAnnotation(isSelected ? null : ann.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer group transition-all ${
                    isSelected
                      ? "bg-[#1f223d] text-white font-semibold border border-indigo-500/40 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                  } ${isHidden ? "opacity-50" : ""}`}
                >
                  {/* Tool shape icon */}
                  <span
                    className="shrink-0 p-0.5 rounded"
                    style={{ color: ann.color }}
                  >
                    {ann.type === "bbox" ? (
                      <Square size={13} />
                    ) : ann.type === "obb" ? (
                      <RotateCw size={13} />
                    ) : (
                      <Hexagon size={13} />
                    )}
                  </span>

                  {/* Label name and index */}
                  <span className="truncate text-xs flex-1">
                    <span className="text-slate-500 font-mono text-[10px] mr-1.5">#{i + 1}</span>
                    <span className={isHidden ? "line-through text-slate-500" : ""}>{ann.label}</span>
                  </span>

                  {/* Action buttons: Lock, Eye, Delete */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {/* Lock toggle */}
                    {onToggleLockAnnotation && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleLockAnnotation(ann.id);
                        }}
                        className={`p-1 rounded transition-colors ${
                          isLocked 
                            ? "text-amber-400 hover:text-amber-300" 
                            : "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white hover:bg-white/10"
                        }`}
                        title={isLocked ? "Unlock annotation" : "Lock annotation"}
                      >
                        {isLocked ? <Lock size={11} /> : <Unlock size={11} />}
                      </button>
                    )}

                    {/* Visibility eye toggle */}
                    {onToggleHideAnnotation && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onToggleHideAnnotation(ann.id);
                        }}
                        className={`p-1 rounded transition-colors ${
                          isHidden 
                            ? "text-slate-500 hover:text-white" 
                            : "opacity-0 group-hover:opacity-100 text-slate-500 hover:text-white hover:bg-white/10"
                        }`}
                        title={isHidden ? "Show annotation" : "Hide annotation"}
                      >
                        {isHidden ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                    )}

                    {/* Delete button */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteAnnotation(ann.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all p-1 hover:bg-white/10 rounded"
                      title="Delete annotation"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
