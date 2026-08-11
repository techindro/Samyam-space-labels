import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft, UploadCloud, FileImage, FileAudio, FileText, Trash2,
  PenLine, Database, Loader2, CheckCircle2, X,
} from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

const BUCKET = "dataset-uploads";
const SIGNED_TTL = 60 * 60 * 24 * 365; // 1 year
const MAX_SIZE = 25 * 1024 * 1024;

type MediaType = "image" | "audio" | "text";

interface DatasetRow { id: string; name: string; item_count: number }
interface FileRow {
  id: string;
  dataset_id: string | null;
  file_name: string;
  storage_path: string;
  media_type: string;
  size_bytes: number;
  preview_url: string | null;
  status: string;
  task_id: string | null;
  created_at: string;
}

const mediaTypeOf = (file: File): MediaType => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("audio/")) return "audio";
  return "text";
};

const iconFor = (t: string) =>
  t === "image" ? FileImage : t === "audio" ? FileAudio : FileText;

const prettySize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const DataUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<DatasetRow[]>([]);
  const [datasetId, setDatasetId] = useState<string>("new");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [labelSchema, setLabelSchema] = useState("Building, Road, Vegetation, Water, Vehicle");

  const [queue, setQueue] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user?.id ?? null));
  }, []);

  const loadAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const [{ data: ds }, { data: fs }] = await Promise.all([
      supabase.from("datasets").select("id, name, item_count").eq("owner_id", userId).order("created_at", { ascending: false }),
      supabase.from("dataset_files").select("*").eq("owner_id", userId).order("created_at", { ascending: false }).limit(60),
    ]);
    setDatasets((ds as DatasetRow[]) ?? []);
    setFiles((fs as FileRow[]) ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = Array.from(list).filter((f) => {
      if (f.size > MAX_SIZE) {
        toast({ title: "File too large", description: `${f.name} is over 25 MB`, variant: "destructive" });
        return false;
      }
      return true;
    });
    setQueue((q) => [...q, ...picked]);
  };

  const totalQueued = useMemo(() => queue.reduce((a, f) => a + f.size, 0), [queue]);

  const ensureDataset = async (): Promise<string> => {
    if (datasetId !== "new") return datasetId;
    const name = newName.trim() || `Upload ${new Date().toLocaleString()}`;
    const { data, error } = await supabase
      .from("datasets")
      .insert({ owner_id: userId!, name, description: newDescription.trim() || null, domain: "geospatial", status: "active" })
      .select("id, name, item_count")
      .single();
    if (error) throw error;
    setDatasets((d) => [data as DatasetRow, ...d]);
    setDatasetId(data.id);
    return data.id;
  };

  const startUpload = async () => {
    if (!userId || queue.length === 0) return;
    setBusy(true);
    setProgress(0);
    try {
      const dsId = await ensureDataset();
      const schema = labelSchema.split(",").map((s) => s.trim()).filter(Boolean);
      let done = 0;

      for (const file of queue) {
        const media = mediaTypeOf(file);
        const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `${userId}/${dsId}/${Date.now()}-${safe}`;

        const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || "application/octet-stream",
        });
        if (upErr) throw upErr;

        const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_TTL);
        const previewUrl = signed?.signedUrl ?? null;

        let taskId: string | null = null;
        if (media === "image") {
          const { data: task } = await supabase
            .from("annotation_tasks")
            .insert({
              dataset_id: dsId,
              created_by: userId,
              assigned_to: userId,
              title: file.name,
              instructions: "Label all relevant objects using the provided schema.",
              label_schema: { classes: schema } as any,
              payload: { imageUrl: previewUrl, storagePath: path, mediaType: media } as any,
              status: "open",
            })
            .select("id")
            .single();
          taskId = task?.id ?? null;
        }

        await supabase.from("dataset_files").insert({
          dataset_id: dsId,
          owner_id: userId,
          file_name: file.name,
          storage_path: path,
          media_type: media,
          mime_type: file.type || null,
          size_bytes: file.size,
          preview_url: previewUrl,
          status: taskId ? "ready" : "uploaded",
          task_id: taskId,
        });

        done += 1;
        setProgress(Math.round((done / queue.length) * 100));
      }

      const { count } = await supabase
        .from("dataset_files")
        .select("id", { count: "exact", head: true })
        .eq("dataset_id", dsId);
      await supabase.from("datasets").update({ item_count: count ?? 0 }).eq("id", dsId);

      toast({ title: "Upload complete", description: `${queue.length} file(s) ingested and ready to label.` });
      setQueue([]);
      await loadAll();
    } catch (e: any) {
      toast({ title: "Upload failed", description: e?.message ?? "Please try again", variant: "destructive" });
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  const removeFile = async (row: FileRow) => {
    await supabase.storage.from(BUCKET).remove([row.storage_path]);
    await supabase.from("dataset_files").delete().eq("id", row.id);
    setFiles((f) => f.filter((x) => x.id !== row.id));
    toast({ title: "File removed" });
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/5 to-transparent pointer-events-none" />

      <div className="border-b border-border/30 glass-card relative z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <span className="font-display text-xl font-bold">Data Ingestion</span>
          <Button size="sm" variant="outline" onClick={() => navigate("/dashboard")}>Dashboard</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Upload your satellite data</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Bring your own optical tiles, SAR chips, audio telemetry or text logs. Files land in private storage,
            get registered to a dataset, and images become annotation tasks you can label immediately.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-6">
          {/* Uploader */}
          <div className="glass-card rounded-2xl p-6 shadow-xl">
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Dataset</Label>
                <select
                  value={datasetId}
                  onChange={(e) => setDatasetId(e.target.value)}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="new">+ Create new dataset</option>
                  {datasets.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Label schema</Label>
                <Input value={labelSchema} onChange={(e) => setLabelSchema(e.target.value)} placeholder="Comma separated classes" />
              </div>
            </div>

            {datasetId === "new" && (
              <div className="grid gap-3 mb-5">
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Dataset name (e.g. Bengaluru LISS-4 tiles)" />
                <Textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="Short description of sensor, region and purpose" rows={2} />
              </div>
            )}

            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
              onClick={() => inputRef.current?.click()}
              className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                dragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50"
              }`}
            >
              <UploadCloud className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="font-medium">Drag & drop files here</p>
              <p className="text-sm text-muted-foreground mt-1">
                Images (GeoTIFF preview, PNG, JPG), audio (WAV, MP3) or text (CSV, JSON, TXT) · max 25 MB each
              </p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/*,audio/*,.csv,.json,.txt,.geojson"
                className="hidden"
                onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
              />
            </div>

            {queue.length > 0 && (
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{queue.length} file(s) queued · {prettySize(totalQueued)}</span>
                  <button className="text-muted-foreground hover:text-foreground" onClick={() => setQueue([])}>Clear</button>
                </div>
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                  {queue.map((f, i) => {
                    const Icon = iconFor(mediaTypeOf(f));
                    return (
                      <div key={`${f.name}-${i}`} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 px-3 py-2">
                        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-sm truncate flex-1">{f.name}</span>
                        <span className="text-xs text-muted-foreground">{prettySize(f.size)}</span>
                        <button onClick={(e) => { e.stopPropagation(); setQueue((q) => q.filter((_, idx) => idx !== i)); }}>
                          <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                    );
                  })}
                </div>
                {busy && <Progress value={progress} className="h-2" />}
                <Button className="w-full gap-2" disabled={busy} onClick={startUpload}>
                  {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Ingesting… {progress}%</> : <><UploadCloud className="h-4 w-4" /> Upload & create tasks</>}
                </Button>
              </div>
            )}
          </div>

          {/* Library */}
          <div className="glass-card rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-display font-semibold">Your uploads</h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
              </div>
            ) : files.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files yet. Upload your first tile to create annotation tasks.</p>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {files.map((row) => {
                  const Icon = iconFor(row.media_type);
                  return (
                    <div key={row.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/60 p-2.5">
                      {row.media_type === "image" && row.preview_url ? (
                        <img src={row.preview_url} alt={row.file_name} loading="lazy" className="h-12 w-12 rounded object-cover border border-border/50" />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{row.file_name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {prettySize(row.size_bytes)} · {row.media_type}
                          {row.status === "ready" && <CheckCircle2 className="h-3 w-3 text-primary" />}
                        </p>
                      </div>
                      {row.task_id && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => navigate(`/annotate/${row.task_id}`)}>
                          <PenLine className="h-3 w-3" /> Label
                        </Button>
                      )}
                      <button onClick={() => removeFile(row)} aria-label="Delete file">
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataUpload;
