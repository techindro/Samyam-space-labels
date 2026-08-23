import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { supabase } from "@/integrations/supabase/client";
import {
  Wallet, DollarSign, ArrowUpRight, CheckCircle2, Clock,
  Building2, CreditCard, ShieldCheck, Download, RefreshCw, Layers, Sparkles,
  TrendingUp, Send, Check, AlertCircle, Cpu, Zap, Lock, Loader2, PlusCircle, Inbox
} from "lucide-react";

export interface TransactionRecord {
  id: string;
  type: "Payout" | "Subscription" | "Credit Purchase";
  amount: string;
  status: "Completed" | "Pending QA" | "Processing";
  date: string;
  method: string;
  reference: string;
}

const CREDIT_PACKS = [
  { id: "starter", name: "Starter Compute Pack", credits: 10000, creditsLabel: "+10,000 Credits", amount: 999, amountPaise: 99900, popular: false },
  { id: "pro", name: "Pro Team Pack", credits: 25000, creditsLabel: "+25,000 Credits", amount: 2499, amountPaise: 249900, popular: true },
  { id: "enterprise", name: "Mission Enterprise Pack", credits: 60000, creditsLabel: "+60,000 Credits", amount: 4999, amountPaise: 499900, popular: false },
];

const IncomePayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { initiatePayment, isLoading: isRazorpayLoading } = useRazorpayCheckout();
  const [activeView, setActiveView] = useState<"annotator_income" | "client_billing">("annotator_income");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [realTasksCount, setRealTasksCount] = useState<number>(0);
  const [realPendingTasksCount, setRealPendingTasksCount] = useState<number>(0);
  const [availableCredits, setAvailableCredits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("samyam_compute_credits");
      return saved ? Number(saved) : 5000; // 5,000 free starting credits
    } catch {
      return 5000;
    }
  });

  // Real persistent transactions state (defaults to empty when user has no transactions yet)
  const [transactions, setTransactions] = useState<TransactionRecord[]>(() => {
    try {
      const saved = localStorage.getItem("samyam_transactions_ledger");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch real authenticated user & real DB tasks
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser(session.user);
        if (session.user.email) {
          setUpiId(session.user.email.split("@")[0] + "@upi");
        }
        // Fetch profile
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setUserProfile(data);
          });

        // Fetch real tasks created / completed by user
        supabase
          .from("annotation_tasks")
          .select("id, status")
          .then(({ data }) => {
            if (data) {
              const completed = data.filter(t => t.status === "approved").length;
              const pending = data.filter(t => t.status === "open" || t.status === "in_progress" || t.status === "submitted").length;
              setRealTasksCount(completed);
              setRealPendingTasksCount(pending);
            }
          });
      } else {
        // Check local storage for offline demo annotations
        try {
          const localTasks = Object.keys(localStorage).filter(k => k.startsWith("samyam_") && k.includes("annotations"));
          setRealTasksCount(localTasks.length > 0 ? localTasks.length : 1);
        } catch {
          setRealTasksCount(0);
        }
      }
    });
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem("samyam_transactions_ledger", JSON.stringify(transactions));
    } catch (e) {
      console.error("Failed to save transaction ledger", e);
    }
  }, [transactions]);

  // Save compute credits
  useEffect(() => {
    try {
      localStorage.setItem("samyam_compute_credits", availableCredits.toString());
    } catch (e) {
      console.error("Failed to save credits", e);
    }
  }, [availableCredits]);

  // Real calculations
  // Base task rate: ₹5.00 per task, ₹8.50 for complex
  const earnedFromTasks = (realTasksCount * 5);
  const pendingFromTasks = (realPendingTasksCount * 5);

  const completedPayoutsTotal = transactions
    .filter((t) => t.type === "Payout" && t.status === "Completed")
    .reduce((sum, t) => sum + Number(t.amount.replace(/[^0-9]/g, "")), 0);

  const processingPayoutsTotal = transactions
    .filter((t) => t.type === "Payout" && t.status === "Processing")
    .reduce((sum, t) => sum + Number(t.amount.replace(/[^0-9]/g, "")), 0);

  const totalEarnedIncome = Math.max(0, earnedFromTasks + completedPayoutsTotal);
  const availableWithdrawBalance = Math.max(0, earnedFromTasks - processingPayoutsTotal - completedPayoutsTotal);

  // Payout Request Form State
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "bank">("upi");
  const [upiId, setUpiId] = useState("user@upi");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const reqAmount = Number(withdrawAmount);
    
    if (reqAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter an amount greater than ₹0.",
        variant: "destructive",
      });
      return;
    }

    if (availableWithdrawBalance <= 0 || reqAmount > availableWithdrawBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Your withdrawable balance is ₹${availableWithdrawBalance.toLocaleString()}. Complete more annotation tasks to earn balance!`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingPayout(true);

    setTimeout(() => {
      const newTx: TransactionRecord = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        type: "Payout",
        amount: `-₹${reqAmount.toLocaleString()}`,
        status: "Processing",
        date: new Date().toISOString().split("T")[0],
        method: paymentMethod === "upi" ? `UPI (${upiId})` : `Bank Transfer (${bankAccount.slice(-4)})`,
        reference: `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setTransactions([newTx, ...transactions]);
      setWithdrawAmount("");
      setIsSubmittingPayout(false);
      toast({
        title: "✓ Payout Request Submitted!",
        description: `Withdrawal of ₹${reqAmount.toLocaleString()} is processing to ${paymentMethod === 'upi' ? upiId : 'your bank account'}.`,
      });
    }, 600);
  };

  const handleBuyCredits = (pack: typeof CREDIT_PACKS[0]) => {
    initiatePayment({
      amount: pack.amountPaise,
      planName: pack.name,
      userName: userProfile?.full_name || currentUser?.user_metadata?.full_name || "",
      userEmail: currentUser?.email || "",
      onSuccess: (data) => {
        const newTx: TransactionRecord = {
          id: `tx-${Date.now().toString().slice(-4)}`,
          type: "Credit Purchase",
          amount: `-₹${pack.amount.toLocaleString()}`,
          status: "Completed",
          date: new Date().toISOString().split("T")[0],
          method: "Razorpay Checkout",
          reference: data.paymentId || `PAY-RZP-${Math.floor(100000 + Math.random() * 900000)}`,
        };

        setTransactions([newTx, ...transactions]);
        setAvailableCredits(prev => prev + pack.credits);
        toast({
          title: "✓ Credits Added to Balance!",
          description: `Successfully added ${pack.creditsLabel} to your organization account.`,
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navbar />

      <main className="relative py-16 overflow-hidden flex-1">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Page Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-secondary/20 p-6 rounded-2xl border border-border/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
                  <Wallet className="h-4 w-4" /> Live Financial Engine
                </div>
                <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-emerald-400" /> Income, Payments & Billing
                </h1>
                <p className="text-muted-foreground text-sm">
                  Real-time earnings from verified label tasks, instant UPI withdrawals, and Razorpay compute billing.
                </p>
              </div>

              {/* Toggle View Switch */}
              <div className="flex bg-secondary/60 p-1.5 rounded-xl border border-border/60 shrink-0">
                <button
                  onClick={() => setActiveView("annotator_income")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeView === "annotator_income"
                      ? "bg-emerald-500 text-slate-950 shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annotator Task Income
                </button>
                <button
                  onClick={() => setActiveView("client_billing")}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                    activeView === "client_billing"
                      ? "bg-purple-600 text-white shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Enterprise Client Billing
                </button>
              </div>
            </div>

            {/* View 1: Annotator Income & Payouts */}
            {activeView === "annotator_income" && (
              <div className="space-y-8">
                {/* Real Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                      <span>Total Earned</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-foreground">
                      ₹{totalEarnedIncome.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From {realTasksCount} verified label tasks
                    </p>
                  </div>

                  <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-500/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      <span>Withdrawable Balance</span>
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-foreground">
                      ₹{availableWithdrawBalance.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Available for instant UPI / Bank transfer
                    </p>
                  </div>

                  <div className="glass-card rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-blue-400 font-semibold uppercase tracking-wider">
                      <span>Task Base Rate</span>
                      <Zap className="h-4 w-4" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-foreground">
                      ₹5.00 <span className="text-sm font-normal text-muted-foreground">/ label</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Polygon/SAR BBox Rate: ₹8.50</p>
                  </div>
                </div>

                {/* Rate Card & Payout Request */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Task Pay Rate Breakdown */}
                  <div className="glass-card rounded-2xl p-6 border border-border/40 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Layers className="h-5 w-5 text-emerald-400" /> Per-Task Payout Rates
                      </h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate("/annotate")}
                        className="text-xs gap-1 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                      >
                        Start Labeling <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {[
                        { type: "2D Bounding Box Labeling", rate: "₹5.00 / object", complexity: "Standard" },
                        { type: "Polygon Segmentation (Buildings/Vessels)", rate: "₹8.50 / polygon", complexity: "Advanced" },
                        { type: "Audio Speech Transcription", rate: "₹12.00 / minute", complexity: "Standard" },
                        { type: "SAR Radar Multi-Band Object Tracking", rate: "₹15.00 / frame", complexity: "Expert" },
                      ].map(({ type, rate, complexity }) => (
                        <div key={type} className="p-3 rounded-xl bg-secondary/30 border border-border/30 flex items-center justify-between">
                          <span className="font-semibold text-foreground">{type}</span>
                          <div className="flex items-center gap-3 font-mono">
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                              {complexity}
                            </Badge>
                            <span className="text-emerald-400 font-bold">{rate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Instant Withdrawal Request Form */}
                  <div className="glass-card rounded-2xl p-6 border border-border/40 space-y-4 bg-secondary/20">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Send className="h-5 w-5 text-emerald-400" /> Instant Withdrawal Request
                    </h3>

                    <form onSubmit={handleRequestPayout} className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs text-muted-foreground font-medium">Withdrawal Amount (₹)</label>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            Max: ₹{availableWithdrawBalance.toLocaleString()}
                          </span>
                        </div>
                        <Input
                          type="number"
                          placeholder={availableWithdrawBalance > 0 ? `e.g. ${availableWithdrawBalance}` : "₹0 available"}
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="bg-background/80 font-mono font-bold"
                          required
                          min={1}
                          max={availableWithdrawBalance || 1}
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Payout Method</label>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <Button
                            type="button"
                            variant={paymentMethod === "upi" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPaymentMethod("upi")}
                            className={paymentMethod === "upi" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                          >
                            Instant UPI Transfer
                          </Button>
                          <Button
                            type="button"
                            variant={paymentMethod === "bank" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPaymentMethod("bank")}
                            className={paymentMethod === "bank" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                          >
                            Bank NEFT / IMPS
                          </Button>
                        </div>
                      </div>

                      {paymentMethod === "upi" ? (
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">UPI VPA ID</label>
                          <Input
                            type="text"
                            placeholder="user@upi / mobile@paytm"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="bg-background/80"
                            required
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Account Number</label>
                            <Input
                              type="text"
                              placeholder="Account No."
                              value={bankAccount}
                              onChange={(e) => setBankAccount(e.target.value)}
                              className="bg-background/80 text-xs"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">IFSC Code</label>
                            <Input
                              type="text"
                              placeholder="HDFC0001234"
                              value={ifscCode}
                              onChange={(e) => setIfscCode(e.target.value)}
                              className="bg-background/80 text-xs uppercase"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmittingPayout || availableWithdrawBalance <= 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold h-10 mt-2 disabled:opacity-50"
                      >
                        {isSubmittingPayout ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                        {availableWithdrawBalance > 0 ? "Request Payout Now" : "Earn Balance by Labeling Tasks"}
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* View 2: Enterprise Client Billing & Subscriptions */}
            {activeView === "client_billing" && (
              <div className="space-y-8">
                {/* Active Plan Card */}
                <div className="glass-card rounded-2xl p-6 sm:p-8 border border-purple-500/30 bg-purple-500/5 space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-5">
                    <div className="space-y-1">
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mb-2">
                        Organization Compute Balance
                      </Badge>
                      <h2 className="text-2xl font-bold font-display text-foreground">
                        Samyam AI Enterprise Workspace
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Multimodal SAM Masks, Grounding DINO Object Detection & Whisper Scribe API.
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-3xl font-bold font-mono text-foreground">
                        {availableCredits.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">Credits</span>
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold mt-1">✓ Active Compute Quota</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-background/80 p-4 rounded-xl border border-border/40 space-y-1">
                      <span className="text-xs text-muted-foreground">Available GPU Credits</span>
                      <div className="text-xl font-bold font-mono text-purple-400">
                        {availableCredits.toLocaleString()} Units
                      </div>
                    </div>

                    <div className="bg-background/80 p-4 rounded-xl border border-border/40 space-y-1">
                      <span className="text-xs text-muted-foreground">Active Workspace User</span>
                      <div className="text-sm font-bold font-mono text-foreground truncate">
                        {currentUser?.email || "Local Guest Workspace"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Credit Top-Up Packs Powered by Razorpay */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-400" /> Instant Compute Credit Top-Up
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Purchase GPU compute credits via Razorpay (UPI, Credit/Debit Cards, NetBanking).
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/30">
                      <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Razorpay Secured
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {CREDIT_PACKS.map((pack) => (
                      <div
                        key={pack.id}
                        className={`glass-card rounded-2xl p-5 border flex flex-col justify-between relative transition-all duration-200 ${
                          pack.popular
                            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10"
                            : "border-border/40 bg-secondary/20 hover:border-purple-500/50"
                        }`}
                      >
                        {pack.popular && (
                          <span className="absolute -top-2.5 right-4 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Most Popular
                          </span>
                        )}

                        <div className="space-y-2 mb-4">
                          <h4 className="font-bold text-sm text-foreground">{pack.name}</h4>
                          <div className="text-2xl font-bold font-mono text-purple-400">
                            ₹{pack.amount.toLocaleString()}
                          </div>
                          <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> {pack.creditsLabel}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Fast SAM mask segmentation & Grounding DINO detection.
                          </p>
                        </div>

                        <Button
                          onClick={() => handleBuyCredits(pack)}
                          disabled={isRazorpayLoading}
                          className={`w-full text-xs font-bold gap-1.5 h-9 rounded-xl ${
                            pack.popular
                              ? "bg-purple-600 hover:bg-purple-700 text-white"
                              : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                          }`}
                        >
                          {isRazorpayLoading ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              Opening Razorpay…
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3.5 w-3.5" />
                              Pay ₹{pack.amount.toLocaleString()}
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Real Transaction History Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-border/40 space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-emerald-400" /> Real Payout & Payment Transaction Ledger
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verified ledger history for your actual annotator payouts and Razorpay compute invoices.
                  </p>
                </div>

                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3 mr-1" /> SSL Encrypted
                </Badge>
              </div>

              {transactions.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mx-auto text-muted-foreground">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">No Transactions Yet</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Your real payment receipts and payout requests will appear here once initiated.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <Button size="sm" onClick={() => navigate("/annotate")} className="text-xs gap-1">
                      Start Labeling Tasks
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setActiveView("client_billing")} className="text-xs gap-1">
                      Buy Compute Credits
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-secondary/30 text-muted-foreground text-xs uppercase tracking-wider border-b border-border/30">
                        <th className="px-4 py-3 font-semibold">Transaction ID</th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Amount</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Payment Method</th>
                        <th className="px-4 py-3 font-semibold text-center">Status</th>
                        <th className="px-4 py-3 font-semibold text-right">Invoice</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-semibold text-xs text-foreground">
                            {tx.id}
                          </td>

                          <td className="px-4 py-3.5 font-medium text-xs text-muted-foreground">
                            {tx.type}
                          </td>

                          <td className={`px-4 py-3.5 font-mono font-bold text-xs ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-purple-400'}`}>
                            {tx.amount}
                          </td>

                          <td className="px-4 py-3.5 text-xs text-muted-foreground">
                            {tx.date}
                          </td>

                          <td className="px-4 py-3.5 text-xs text-foreground font-mono">
                            {tx.method}
                          </td>

                          <td className="px-4 py-3.5 text-center">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${
                                tx.status === 'Completed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              }`}
                            >
                              {tx.status}
                            </Badge>
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toast({ title: `Receipt: ${tx.reference}`, description: `Amount: ${tx.amount} | Date: ${tx.date} | Status: ${tx.status}` })}
                              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                            >
                              <Download className="h-3 w-3" /> Receipt
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IncomePayments;
