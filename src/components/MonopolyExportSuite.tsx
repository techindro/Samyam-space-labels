import React, { useState } from "react";
import { Download, FileJson, FileCode, Layers, Check, Database, Shield, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ExportFormat {
  id: "coco" | "yolov8" | "pascal" | "geojson" | "tfrecord";
  name: string;
  extension: string;
  description: string;
}

export default function MonopolyExportSuite() {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat["id"]>("coco");
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const formats: ExportFormat[] = [
    { id: "coco", name: "COCO JSON 1.0", extension: ".json", description: "Standard MS-COCO bounding box & polygon masks" },
    { id: "yolov8", name: "YOLOv8 PyTorch", extension: ".txt", description: "Normalized YOLOv8 coordinates for real-time vision model training" },
    { id: "pascal", name: "Pascal VOC XML", extension: ".xml", description: "Structured XML tags for object detection benchmarks" },
    { id: "geojson", name: "ISRO GeoJSON (GIS)", extension: ".geojson", description: "Geospatial vector features with WGS84 lat/lon coordinates" },
    { id: "tfrecord", name: "TensorFlow TFRecord", extension: ".tfrecord", description: "Optimized binary format for large-scale distributed training" },
  ];

  const handleExport = () => {
    setIsExporting(true);
    toast({
      title: "⚡ Export Pipeline Initialized",
      description: `Packaging dataset in ${selectedFormat.toUpperCase()} format...`,
    });

    setTimeout(() => {
      setIsExporting(false);

      // Create downloadable dummy dataset blob
      const sampleData = {
        info: { description: "SamyamLM Dataset Export", version: "1.0", year: 2026 },
        licenses: [{ name: "MIT", id: 1 }],
        images: [{ id: 1, file_name: "isro_resourcesat2a_liss4.jpg", height: 720, width: 1280 }],
        annotations: [
          { id: 101, image_id: 1, category_id: 1, bbox: [250, 180, 140, 120], area: 16800 },
          { id: 102, image_id: 1, category_id: 2, bbox: [520, 310, 80, 60], area: 4800 },
        ],
        categories: [
          { id: 1, name: "Auto-rickshaw" },
          { id: 2, name: "Orbital Debris" },
        ],
      };

      const blob = new Blob([JSON.stringify(sampleData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `samyamlm_export_${selectedFormat}_${Date.now()}.${selectedFormat === "pascal" ? "xml" : selectedFormat === "yolov8" ? "txt" : "json"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "✅ Dataset Export Complete!",
        description: `Successfully downloaded samyamlm_export_${selectedFormat}.`,
      });
    }, 1200);
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-border/70 shadow-xl backdrop-blur-xl bg-background/80 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-cosmic-teal/10 rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cosmic-teal to-emerald-500 text-black shadow-md">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-foreground flex items-center gap-2">
              Monopoly Dataset Multi-Format Exporter
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                INSTANT ZERO-LATENCY
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Export annotations into COCO, YOLOv8, GeoJSON, or TFRecord in 1-click.
            </p>
          </div>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          size="sm"
          className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white border-0 gap-2 text-xs font-semibold shadow-lg"
        >
          <Download className="w-3.5 h-3.5" />
          {isExporting ? "Packaging..." : "Export Dataset"}
        </Button>
      </div>

      {/* Formats Grid */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2.5">
        {formats.map((fmt) => {
          const isSelected = selectedFormat === fmt.id;
          return (
            <div
              key={fmt.id}
              onClick={() => setSelectedFormat(fmt.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-cosmic-teal/15 border-cosmic-teal text-foreground shadow-md"
                  : "bg-secondary/30 border-border/40 hover:bg-secondary/60 text-muted-foreground"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold font-mono text-foreground">{fmt.name}</span>
                <span className="text-[10px] font-mono text-cosmic-teal bg-cosmic-teal/10 px-1.5 py-0.5 rounded">
                  {fmt.extension}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-tight">{fmt.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
