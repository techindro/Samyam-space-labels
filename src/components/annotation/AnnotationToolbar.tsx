import type { Tool } from "./useAnnotationState";
import { MousePointer2, Square, Hexagon, Trash2, Undo2, Redo2, ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  tool: Tool;
  onSetTool: (t: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface ToolBtn {
  id: Tool;
  icon: React.ReactNode;
  label: string;
  shortcut: string;
}

const tools: ToolBtn[] = [
  { id: "select",  icon: <MousePointer2 size={18} />, label: "Select / Move", shortcut: "V" },
  { id: "bbox",    icon: <Square        size={18} />, label: "Bounding Box",  shortcut: "B" },
  { id: "polygon", icon: <Hexagon       size={18} />, label: "Polygon",       shortcut: "P" },
  { id: "delete",  icon: <Trash2        size={18} />, label: "Delete",        shortcut: "D" },
];

export default function AnnotationToolbar({
  tool, onSetTool, onUndo, onRedo, canUndo, canRedo,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-1 px-1.5 py-3 bg-[#0f0f1e] border-r border-white/10 w-12 shrink-0 select-none">

      {/* Tool buttons */}
      {tools.map(btn => (
        <button
          key={btn.id}
          title={`${btn.label}  (${btn.shortcut})`}
          onClick={() => onSetTool(btn.id)}
          className={`
            w-9 h-9 flex items-center justify-center rounded-lg transition-all
            ${tool === btn.id
              ? "bg-cosmic-purple text-white shadow-lg shadow-cosmic-purple/30"
              : "text-white/50 hover:text-white hover:bg-white/10"}
          `}
        >
          {btn.icon}
        </button>
      ))}

      {/* Divider */}
      <div className="w-6 h-px bg-white/10 my-1" />

      {/* Undo */}
      <button
        title="Undo  (Ctrl+Z)"
        onClick={onUndo}
        disabled={!canUndo}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
      >
        <Undo2 size={16} />
      </button>

      {/* Redo */}
      <button
        title="Redo  (Ctrl+Y)"
        onClick={onRedo}
        disabled={!canRedo}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
      >
        <Redo2 size={16} />
      </button>
    </div>
  );
}
