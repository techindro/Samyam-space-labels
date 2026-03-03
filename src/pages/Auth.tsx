import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Lock, Mail, User, KeyRound, ArrowLeft } from "lucide-react";

type AuthMode = "login" | "signup" | "otp-request" | "otp-verify";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { a, b, answer: a + b };
  }

  const refreshCaptcha = () => setCaptcha(generateCaptcha());

  const validateCaptcha = () => {
    if (parseInt(captchaAnswer) !== captcha.answer) {
      toast({ title: "Captcha incorrect", description: "Please solve the math problem correctly.", variant: "destructive" });
      refreshCaptcha();
      setCaptchaAnswer("");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/dashboard");
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    if (username.length < 3) {
      toast({ title: "Username too short", description: "Username must be at least 3 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { username, full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We sent a verification link to your email." });
    }
  };

  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send OTP", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "OTP sent!", description: "Check your email for the one-time code." });
      setMode("otp-verify");
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ email, token: otpToken, type: "email" });
    setLoading(false);
    if (error) {
      toast({ title: "Verification failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome!" });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 star-field">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-['Space_Grotesk']">
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "otp-request" && "OTP Login"}
              {mode === "otp-verify" && "Verify OTP"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {mode === "login" && "Welcome back to Surya"}
              {mode === "signup" && "Join us today"}
              {mode === "otp-request" && "We'll send a code to your email"}
              {mode === "otp-verify" && "Enter the code from your email"}
            </p>
          </div>

          {/* Login */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2"><Lock className="w-4 h-4" /> Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
              </div>
              <CaptchaField captcha={captcha} captchaAnswer={captchaAnswer} setCaptchaAnswer={setCaptchaAnswer} refreshCaptcha={refreshCaptcha} />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign In"}</Button>
              <div className="text-center text-sm space-y-1 pt-2">
                <p className="text-muted-foreground"><a href="/forgot-password" className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">Forgot password?</a></p>
                <p className="text-muted-foreground">Don't have an account? <button type="button" onClick={() => { setMode("signup"); refreshCaptcha(); setCaptchaAnswer(""); }} className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">Sign Up</button></p>
                <p className="text-muted-foreground">Or <button type="button" onClick={() => { setMode("otp-request"); refreshCaptcha(); setCaptchaAnswer(""); }} className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">Login with OTP</button></p>
              </div>
            </form>
          )}

          {/* Signup */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-2"><User className="w-4 h-4" /> Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2"><User className="w-4 h-4" /> Username</Label>
                <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="johndoe" minLength={3} maxLength={30} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                <Input id="signupEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword" className="flex items-center gap-2"><Lock className="w-4 h-4" /> Password</Label>
                <Input id="signupPassword" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" minLength={6} />
              </div>
              <CaptchaField captcha={captcha} captchaAnswer={captchaAnswer} setCaptchaAnswer={setCaptchaAnswer} refreshCaptcha={refreshCaptcha} />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Creating account..." : "Sign Up"}</Button>
              <p className="text-center text-sm text-muted-foreground pt-2">Already have an account? <button type="button" onClick={() => { setMode("login"); refreshCaptcha(); setCaptchaAnswer(""); }} className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">Sign In</button></p>
            </form>
          )}

          {/* OTP Request */}
          {mode === "otp-request" && (
            <form onSubmit={handleOtpRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otpEmail" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email</Label>
                <Input id="otpEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <CaptchaField captcha={captcha} captchaAnswer={captchaAnswer} setCaptchaAnswer={setCaptchaAnswer} refreshCaptcha={refreshCaptcha} />
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Sending..." : "Send OTP Code"}</Button>
              <p className="text-center text-sm text-muted-foreground pt-2">
                <button type="button" onClick={() => { setMode("login"); refreshCaptcha(); setCaptchaAnswer(""); }} className="text-foreground font-medium underline underline-offset-4 hover:opacity-80 flex items-center gap-1 mx-auto"><ArrowLeft className="w-3 h-3" /> Back to Sign In</button>
              </p>
            </form>
          )}

          {/* OTP Verify */}
          {mode === "otp-verify" && (
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otpCode" className="flex items-center gap-2"><KeyRound className="w-4 h-4" /> OTP Code</Label>
                <Input id="otpCode" value={otpToken} onChange={(e) => setOtpToken(e.target.value)} required placeholder="123456" maxLength={6} className="text-center text-2xl tracking-[0.5em]" />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Verifying..." : "Verify & Sign In"}</Button>
              <p className="text-center text-sm text-muted-foreground pt-2">
                <button type="button" onClick={() => { setMode("otp-request"); refreshCaptcha(); setCaptchaAnswer(""); }} className="text-foreground font-medium underline underline-offset-4 hover:opacity-80">Resend code</button>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const CaptchaField = ({ captcha, captchaAnswer, setCaptchaAnswer, refreshCaptcha }: {
  captcha: { a: number; b: number; answer: number };
  captchaAnswer: string;
  setCaptchaAnswer: (v: string) => void;
  refreshCaptcha: () => void;
}) => (
  <div className="space-y-2">
    <Label className="flex items-center gap-2">
      <KeyRound className="w-4 h-4" /> Captcha
    </Label>
    <div className="flex items-center gap-3">
      <div className="bg-muted px-4 py-2 rounded-lg font-mono text-lg font-bold tracking-wider select-none">
        {captcha.a} + {captcha.b} = ?
      </div>
      <Input
        type="number"
        value={captchaAnswer}
        onChange={(e) => setCaptchaAnswer(e.target.value)}
        required
        placeholder="?"
        className="w-20 text-center"
      />
      <button type="button" onClick={refreshCaptcha} className="text-xs text-muted-foreground hover:text-foreground underline">New</button>
    </div>
  </div>
);

export default Auth;
