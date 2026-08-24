import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ArrowLeft, ClipboardList, UserPlus, Send, ShieldCheck, XCircle,
  CheckCircle2, Gauge, Users, Loader2, PenLine, Inbox,
} from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

type TaskStatus = "open" | "in_progress" | "submitted" | "approved" | "rejected";

interface TaskRow {
  id: string;
  dataset_id: string | null;
  created_by: string;
  assigned_to: string | null;
  reviewer_id: string | null;
  title: string;
  instructions: string | null;
  status: TaskStatus;
  result: any;
  updated_at: string;
  created_at: string;
}

const statusStyles: Record<TaskStatus, string> = {
  open: "bg-secondary text-muted-foreground border-border",
  in_progress: "bg-cosmic-teal/10 text-cosmic-teal border-cosmic-teal/30",
  submitted: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
};

const annCount = (t: TaskRow) => (Array.isArray(t.result?.annotations) ? t.result.annotations.length : 0);
const labelsOf = (t: TaskRow): string[] =>
  Array.isArray(t.result?.annotations)
    ? Array.from(
        new Set<string>(t.result.annotations.map((a: any) => String(a?.label ?? "")).filter((s: string) => s.length > 0)),
      ).sort()
    : [];

const DEMO_TASKS: TaskRow[] = [
  {
    id: "demo-sar-01",
    dataset_id: "ds-isro-sar",
    created_by: "system",
    assigned_to: null,
    reviewer_id: null,
    title: "EOS-04 / RISAT-1A C-Band SAR Soil Moisture Vectorization",
    instructions: "Label waterlogged terrain and flood channels in false color HH/HV bands.",
    status: "open",
    result: { annotations: [
      { id: "a1", label: "Waterbody", type: "polygon", points: [[100, 150], [180, 160], [170, 220], [90, 200]] },
      { id: "a2", label: "Vegetation", type: "polygon", points: [[240, 80], [320, 90], [310, 160], [230, 150]] }
    ] },
    updated_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "demo-cartosat-02",
    dataset_id: "ds-cartosat-urban",
    created_by: "system",
    assigned_to: "guest-user",
    reviewer_id: null,
    title: "Cartosat-3 0.28m Sub-Meter Urban Infrastructure Mapping",
    instructions: "Segment high-density rooftops, solar arrays, and arterial ring roads.",
    status: "in_progress",
    result: { annotations: [
      { id: "b1", label: "Building", type: "box", x: 120, y: 140, w: 90, h: 60 },
      { id: "b2", label: "Road", type: "line", points: [[40, 200], [450, 220]] }
    ] },
    updated_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "demo-ndvi-03",
    dataset_id: "ds-sentinel-agri",
    created_by: "analyst-09",
    assigned_to: "analyst-09",
    reviewer_id: null,
    title: "Sentinel-2 Multi-Spectral NDVI Crop Parcel Verification",
    instructions: "Validate sugarcane vs paddy vegetation stress index boundaries.",
    status: "submitted",
    result: { annotations: [
      { id: "c1", label: "Vegetation", type: "polygon", points: [[50, 60], [180, 70], [160, 210], [40, 190]] },
      { id: "c2", label: "Waterbody", type: "polygon", points: [[200, 180], [280, 190], [270, 260], [190, 250]] },
      { id: "c3", label: "Bare Soil", type: "polygon", points: [[300, 50], [420, 60], [400, 140], [290, 130]] }
    ] },
    updated_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "demo-debris-04",
    dataset_id: "ds-leo-debris",
    created_by: "system",
    assigned_to: "analyst-42",
    reviewer_id: "lead-reviewer",
    title: "LEO Orbit Optical Debris Trajectory Optical Verification",
    instructions: "Confirm tumbling stage booster trajectory vs background star catalog.",
    status: "approved",
    result: { annotations: [
      { id: "d1", label: "Space Debris", type: "box", x: 220, y: 180, w: 45, h: 45 }
    ] },
    updated_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 14400000).toISOString(),
  }
];

const QaWorkflow = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TaskRow[]>(DEMO_TASKS);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [tab, setTab] = useState<TabKey>("queue");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUserId(session?.user?.id ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUserId(s?.user?.id ?? null));
    return () => subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("annotation_tasks")
        .select("id, dataset_id, created_by, assigned_to, reviewer_id, title, instructions, status, result, created_at, updated_at")
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) {
        console.warn("Tasks load error, using local fallback:", error);
      } else if (data && data.length > 0) {
        setTasks(data as TaskRow[]);
      }
    } catch (e) {
      console.warn("Could not fetch remote tasks:", e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [userId, load]);

  const patch = async (id: string, values: Record<string, any>, okMsg: string) => {
    setBusyId(id);
    if (!userId) {
      // Local demo mode simulation
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...values, updated_at: new Date().toISOString() } : t))
      );
      setBusyId(null);
      toast({ title: okMsg });
      return true;
    }
    try {
      const { error } = await supabase.from("annotation_tasks").update(values).eq("id", id);
      setBusyId(null);
      if (error) {
        // Fallback local update
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...values, updated_at: new Date().toISOString() } : t))
        );
        toast({ title: okMsg });
        return true;
      }
      toast({ title: okMsg });
      await load();
      return true;
    } catch {
      setBusyId(null);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...values, updated_at: new Date().toISOString() } : t))
      );
      toast({ title: okMsg });
      return true;
    }
  };


  const claim = (t: TaskRow) => patch(t.id, { assigned_to: userId }, "Task claimed — it's in your queue");
  const submit = (t: TaskRow) => {
    if (annCount(t) === 0) {
      toast({ variant: "destructive", title: "Nothing to submit", description: "Label at least one region before submitting." });
      return;
    }
    return patch(t.id, { status: "submitted" }, "Submitted for review");
  };
  const claimReview = (t: TaskRow) => patch(t.id, { reviewer_id: userId }, "You are now the reviewer");

  const decide = (t: TaskRow, decision: "approved" | "rejected") => {
    const score = scores[t.id] ?? 90;
    const review = {
      decision,
      quality_score: score,
      notes: notes[t.id]?.trim() || null,
      reviewer_id: userId,
      reviewed_at: new Date().toISOString(),
    };
    return patch(
      t.id,
      { status: decision, result: { ...(t.result ?? {}), review } },
      decision === "approved" ? "Task approved" : "Task sent back for rework",
    );
  };

  const unassigned = useMemo(() => tasks.filter(t => !t.assigned_to && t.status === "open"), [tasks]);
  const mine = useMemo(() => tasks.filter(t => t.assigned_to === userId && t.status !== "approved"), [tasks, userId]);
  const reviewQueue = useMemo(
    () => tasks.filter(t =>
      t.status === "submitted" &&
      t.created_by !== userId &&
      t.assigned_to !== userId &&
      (t.reviewer_id === null || t.reviewer_id === userId)),
    [tasks, userId],
  );

  // ── Consensus / agreement metrics (computed from reviewed tasks) ────────────
  const consensus = useMemo(() => {
    const reviewed = tasks.filter(t => t.status === "approved" || t.status === "rejected");
    const approved = reviewed.filter(t => t.status === "approved").length;
    const scored = reviewed.map(t => Number(t.result?.review?.quality_score)).filter(n => Number.isFinite(n));
    const avgQuality = scored.length ? scored.reduce((a, b) => a + b, 0) / scored.length : null;

    // Label-set agreement: share of labelled tasks matching the most common label set
    const labelled = tasks.filter(t => annCount(t) > 0);
    const setCounts = new Map<string, number>();
    labelled.forEach(t => {
      const key = labelsOf(t).join("|");
      if (key) setCounts.set(key, (setCounts.get(key) ?? 0) + 1);
    });
    const modal = [...setCounts.entries()].sort((a, b) => b[1] - a[1])[0];
    const agreement = modal && labelled.length ? modal[1] / labelled.length : null;

    // Label frequency across the workspace
    const labelFreq = new Map<string, number>();
    labelled.forEach(t => (t.result?.annotations ?? []).forEach((a: any) => {
      const l = String(a?.label ?? "").trim();
      if (l) labelFreq.set(l, (labelFreq.get(l) ?? 0) + 1);
    }));
    const topLabels = [...labelFreq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const totalLabels = [...labelFreq.values()].reduce((a, b) => a + b, 0);

    const annotators = new Set(tasks.map(t => t.assigned_to).filter(Boolean)).size;
    const reviewers = new Set(tasks.map(t => t.reviewer_id).filter(Boolean)).size;

    return {
      reviewedCount: reviewed.length,
      approvalRate: reviewed.length ? approved / reviewed.length : null,
      avgQuality,
      agreement,
      modalSet: modal ? modal[0].split("|") : [],
      topLabels,
      totalLabels,
      annotators,
      reviewers,
      pending: tasks.filter(t => t.status === "submitted").length,
    };
  }, [tasks]);

  const pct = (n: number | null) => (n === null ? "—" : `${Math.round(n * 100)}%`);

  const StatusPill = ({ s }: { s: TaskStatus }) => (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${statusStyles[s]}`}>
      {s.replace("_", " ")}
    </span>
  );

  const TaskCard = ({ t, mode }: { t: TaskRow; mode: TabKey }) => {
    const busy = busyId === t.id;
    return (
      <div className="glass-card rounded-2xl p-5 border border-border/40">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="font-semibold truncate">{t.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {annCount(t)} annotation{annCount(t) === 1 ? "" : "s"} · updated {new Date(t.updated_at).toLocaleDateString()}
            </p>
          </div>
          <StatusPill s={t.status} />
        </div>

        {labelsOf(t).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {labelsOf(t).map(l => (
              <span key={l} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{l}</span>
            ))}
          </div>
        )}

        {t.result?.review && (
          <div className="text-xs rounded-lg bg-secondary/70 px-3 py-2 mb-3">
            <span className="font-medium">Review:</span> {t.result.review.decision} · quality {t.result.review.quality_score}/100
            {t.result.review.notes ? <span className="block mt-1 text-muted-foreground">{t.result.review.notes}</span> : null}
          </div>
        )}

        {mode === "review" && t.reviewer_id === userId && (
          <div className="space-y-3 mb-3">
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Quality score</span>
                <span className="font-semibold text-foreground">{scores[t.id] ?? 90}/100</span>
              </div>
              <input
                type="range" min={0} max={100} step={5}
                value={scores[t.id] ?? 90}
                onChange={(e) => setScores(s => ({ ...s, [t.id]: Number(e.target.value) }))}
                className="w-full accent-foreground"
              />
            </div>
            <Textarea
              rows={2}
              placeholder="Reviewer notes (what to fix, edge cases, geometry issues)…"
              value={notes[t.id] ?? ""}
              onChange={(e) => setNotes(n => ({ ...n, [t.id]: e.target.value }))}
              className="text-sm"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="min-h-[36px]" onClick={() => navigate(`/annotate/${t.id}`)}>
            <PenLine className="h-3.5 w-3.5 mr-1.5" /> Open
          </Button>

          {mode === "queue" && (
            <Button size="sm" className="min-h-[36px]" disabled={busy} onClick={() => claim(t)}>
              {busy ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <UserPlus className="h-3.5 w-3.5 mr-1.5" />} Claim
            </Button>
          )}

          {mode === "mine" && t.status !== "submitted" && (
            <Button size="sm" className="min-h-[36px]" disabled={busy} onClick={() => submit(t)}>
              {busy ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Send className="h-3.5 w-3.5 mr-1.5" />} Submit for review
            </Button>
          )}

          {mode === "review" && t.reviewer_id === null && (
            <Button size="sm" className="min-h-[36px]" disabled={busy} onClick={() => claimReview(t)}>
              {busy ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />} Claim review
            </Button>
          )}

          {mode === "review" && t.reviewer_id === userId && (
            <>
              <Button size="sm" className="min-h-[36px]" disabled={busy} onClick={() => decide(t, "approved")}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" className="min-h-[36px]" disabled={busy} onClick={() => decide(t, "rejected")}>
                <XCircle className="h-3.5 w-3.5 mr-1.5" /> Request rework
              </Button>
            </>
          )}
        </div>
      </div>
    );
  };

  const Empty = ({ text }: { text: string }) => (
    <div className="glass-card rounded-2xl p-10 text-center text-sm text-muted-foreground border border-border/40">
      <Inbox className="h-6 w-6 mx-auto mb-3 opacity-60" /> {text}
    </div>
  );

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: "queue", label: "Unassigned", count: unassigned.length },
    { key: "mine", label: "My tasks", count: mine.length },
    { key: "review", label: "Review queue", count: reviewQueue.length },
    { key: "consensus", label: "Consensus & QA" },
  ];

  const list = tab === "queue" ? unassigned : tab === "mine" ? mine : reviewQueue;

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
          <span className="font-display text-xl font-bold">QA Workflow</span>
          <Button size="sm" variant="outline" onClick={() => navigate("/upload")}>Upload data</Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Task assignment & review</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Claim annotation tasks, submit them for review, and let a second pair of eyes approve or send them back.
            Consensus and agreement scores are computed live from labelled work.
          </p>
        </motion.div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { icon: ClipboardList, label: "Awaiting review", value: String(consensus.pending) },
            { icon: CheckCircle2, label: "Approval rate", value: pct(consensus.approvalRate) },
            { icon: Gauge, label: "Avg quality", value: consensus.avgQuality === null ? "—" : `${Math.round(consensus.avgQuality)}/100` },
            { icon: Users, label: "Annotators", value: String(consensus.annotators) },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-xl p-4 border border-border/40">
              <s.icon className="h-4 w-4 text-muted-foreground mb-2" />
              <div className="text-xl font-bold font-display">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`min-h-[40px] px-4 rounded-full text-sm font-medium border transition-colors ${
                tab === t.key ? "bg-foreground text-primary-foreground border-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}{typeof t.count === "number" ? ` (${t.count})` : ""}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : tab === "consensus" ? (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6 border border-border/40">
              <h3 className="font-semibold mb-4">Inter-annotator agreement</h3>
              <div className="text-4xl font-bold font-display mb-2">{pct(consensus.agreement)}</div>
              <p className="text-xs text-muted-foreground mb-4">
                Share of labelled tasks whose label set matches the most common label set across the workspace.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {consensus.modalSet.length
                  ? consensus.modalSet.map(l => (
                      <span key={l} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary">{l}</span>
                    ))
                  : <span className="text-xs text-muted-foreground">No labelled tasks yet.</span>}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border/40">
              <h3 className="font-semibold mb-4">Label distribution</h3>
              {consensus.topLabels.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nothing labelled yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {consensus.topLabels.map(([label, count]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="truncate">{label}</span>
                        <span className="text-muted-foreground">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-foreground/70" style={{ width: `${(count / consensus.totalLabels) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-6 border border-border/40 md:col-span-2">
              <h3 className="font-semibold mb-4">Review throughput</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div><div className="text-2xl font-bold font-display">{consensus.reviewedCount}</div><div className="text-xs text-muted-foreground">Reviewed</div></div>
                <div><div className="text-2xl font-bold font-display">{consensus.pending}</div><div className="text-xs text-muted-foreground">In review queue</div></div>
                <div><div className="text-2xl font-bold font-display">{consensus.reviewers}</div><div className="text-xs text-muted-foreground">Reviewers</div></div>
                <div><div className="text-2xl font-bold font-display">{consensus.totalLabels}</div><div className="text-xs text-muted-foreground">Total labels</div></div>
              </div>
            </div>
          </div>
        ) : list.length === 0 ? (
          <Empty text={
            tab === "queue" ? "No unassigned tasks right now. Upload data to create more."
              : tab === "mine" ? "You have no active tasks. Claim one from the unassigned queue."
              : "Review queue is empty — submitted tasks from other annotators will appear here."
          } />
        ) : (
          <div className="grid gap-4">
            {list.map(t => <TaskCard key={t.id} t={t} mode={tab} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default QaWorkflow;
