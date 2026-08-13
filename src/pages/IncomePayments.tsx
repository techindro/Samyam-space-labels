import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Wallet, DollarSign, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock,
  Building2, CreditCard, ShieldCheck, Download, RefreshCw, Layers, Sparkles,
  TrendingUp, Send, Check, AlertCircle, Cpu, Zap, Lock
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

const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  { id: "tx-901", type: "Payout", amount: "+₹14,500", status: "Completed", date: "2026-08-10", method: "UPI (rahul@upi)", reference: "UPI/389102981" },
  { id: "tx-902", type: "Payout", amount: "+₹8,200", status: "Completed", date: "2026-08-01", method: "HDFC Bank Direct", reference: "NEFT/88129012" },
  { id: "tx-903", type: "Payout", amount: "+₹12,400", status: "Pending QA", date: "2026-08-13", method: "Pending Approval", reference: "QA-Batch-#401" },
  { id: "tx-904", type: "Subscription", amount: "-₹9,999", status: "Completed", date: "2026-08-05", method: "Visa **** 4920", reference: "INV-2026-081" },
  { id: "tx-905", type: "Credit Purchase", amount: "-₹4,999", status: "Completed", date: "2026-07-28", method: "Razorpay Checkout", reference: "PAY-RZP-9921" },
];

const IncomePayments = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"annotator_income" | "client_billing">("annotator_income");
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);

  // Payout Request Form State
  const [withdrawAmount, setWithdrawAmount] = useState("12400");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [upiId, setUpiId] = useState("samyam@upi");
  const [bankAccount, setBankAccount] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  // Payment Gateway Checkout Modal State
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPayout(true);

    setTimeout(() => {
      const newTx: TransactionRecord = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        type: "Payout",
        amount: `+₹${Number(withdrawAmount).toLocaleString()}`,
        status: "Processing",
        date: new Date().toISOString().split("T")[0],
        method: paymentMethod === "upi" ? `UPI (${upiId})` : "Bank Transfer",
        reference: `REQ-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setTransactions([newTx, ...transactions]);
      setIsSubmittingPayout(false);
      toast({
        title: "✓ Payout Request Submitted!",
        description: `Requested ₹${Number(withdrawAmount).toLocaleString()} withdrawal. Approval processing in 24 hours.`,
      });
    }, 1000);
  };

  const handleBuyCredits = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const newTx: TransactionRecord = {
        id: `tx-${Date.now().toString().slice(-4)}`,
        type: "Credit Purchase",
        amount: "-₹2,499",
        status: "Completed",
        date: new Date().toISOString().split("T")[0],
        method: "Razorpay / Stripe Gateway",
        reference: `PAY-RZP-${Math.floor(100000 + Math.random() * 900000)}`,
      };

      setTransactions([newTx, ...transactions]);
      setIsProcessingPayment(false);
      toast({
        title: "✓ Payment Successful!",
        description: "Added +25,000 AI Auto-Labeling Compute Credits to your organization balance.",
      });
    }, 1200);
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
                  <Wallet className="h-4 w-4" /> Financial Operations & Payouts Engine
                </div>
                <h1 className="text-3xl font-bold font-display text-foreground flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-emerald-400" /> Income, Payments & Billing
                </h1>
                <p className="text-muted-foreground text-sm">
                  Manage annotator per-label task earnings, instant UPI/Bank withdrawals, and enterprise subscription billing.
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
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                      <span>Total Income Earned</span>
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-foreground">
                      ₹35,100
                    </div>
                    <p className="text-xs text-muted-foreground">From 7,020 completed label tasks</p>
                  </div>

                  <div className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-amber-500/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      <span>Pending QA Review Payout</span>
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="text-3xl font-bold font-mono text-foreground">
                      ₹12,400
                    </div>
                    <p className="text-xs text-muted-foreground">Available for withdrawal post QA check</p>
                  </div>

                  <div className="glass-card rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-blue-400 font-semibold uppercase tracking-wider">
                      <span>Average Task Rate</span>
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
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <Layers className="h-5 w-5 text-emerald-400" /> Per-Task Payout Rates
                    </h3>
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
                        <label className="text-xs text-muted-foreground font-medium mb-1 block">Withdrawal Amount (₹)</label>
                        <Input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="bg-background/80 font-mono font-bold"
                          required
                          max={12400}
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
                              className="bg-background/80 text-xs"
                              required
                            />
                          </div>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmittingPayout}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold h-10 mt-2"
                      >
                        {isSubmittingPayout ? (
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}
                        Request Payout Now
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
                        Active Enterprise Plan
                      </Badge>
                      <h2 className="text-2xl font-bold font-display text-foreground">
                        Samyam Pro Enterprise Subscription
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Unlimited Multimodal BBox/Polygon Labeling + Priority GPU Acceleration.
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-3xl font-bold font-mono text-foreground">
                        ₹9,999 <span className="text-sm font-normal text-muted-foreground">/ month</span>
                      </div>
                      <p className="text-xs text-emerald-400 font-semibold mt-1">✓ Renews on Sep 5, 2026</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-background/80 p-4 rounded-xl border border-border/40 space-y-1">
                      <span className="text-xs text-muted-foreground">Auto-Label Compute Credits</span>
                      <div className="text-xl font-bold font-mono text-purple-400">
                        42,500 / 50,000
                      </div>
                    </div>

                    <div className="bg-background/80 p-4 rounded-xl border border-border/40 space-y-1">
                      <span className="text-xs text-muted-foreground">Active Team Seats</span>
                      <div className="text-xl font-bold font-mono text-foreground">
                        12 / 25 seats
                      </div>
                    </div>

                    <div className="bg-background/80 p-4 rounded-xl border border-border/40 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground block">Top-Up Credits</span>
                        <span className="text-xs font-semibold text-foreground">+25,000 Credits</span>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleBuyCredits}
                        disabled={isProcessingPayment}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs gap-1 h-8"
                      >
                        {isProcessingPayment ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                        Buy ₹2,499
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shared Transaction History Table */}
            <div className="glass-card rounded-2xl overflow-hidden border border-border/40 space-y-4 p-6">
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <RefreshCw className="h-5 w-5 text-emerald-400" /> Payout & Payment Transaction Ledger
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Verified ledger history for annotator payouts, bank transfers, and client invoices.
                  </p>
                </div>

                <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3 mr-1" /> SSL Encrypted
                </Badge>
              </div>

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
                            onClick={() => toast({ title: `Downloaded Receipt ${tx.reference}` })}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                          >
                            <Download className="h-3 w-3" /> PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default IncomePayments;
