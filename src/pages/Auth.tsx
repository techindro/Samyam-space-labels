import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Lock, Mail, User, KeyRound, ArrowLeft } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

// Google SVG Icon
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.04 29.53 1 24 1 14.82 1 6.97 6.48 3.25 14.33l7.1 5.52C12.06 13.72 17.56 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.68c-.55 2.96-2.2 5.47-4.69 7.16l7.19 5.59C43.54 37.07 46.5 31.22 46.5 24.5z"/>
    <path fill="#FBBC05" d="M10.35 28.15A14.5 14.5 0 0 1 9.5 24c0-1.45.2-2.85.55-4.15l-7.1-5.52A23.94 23.94 0 0 0 0 24c0 3.87.93 7.52 2.58 10.74l7.77-6.59z"/>
    <path fill="#34A853" d="M24 47c5.39 0 9.92-1.79 13.23-4.86l-7.19-5.59C28.26 38.06 26.24 38.5 24 38.5c-6.44 0-11.94-4.22-13.65-9.85l-7.77 6.59C6.97 43.52 14.82 47 24 47z"/>
  </svg>
);

// GitHub SVG Icon
const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const safeNext = (raw: string | null): string | null => {
  if (!raw) return null;
  // same-origin relative path only
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
};

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
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nextPath = safeNext(searchParams.get("next"));
  const goNext = () => navigate(nextPath ?? "/dashboard");
  const { toast } = useToast();

  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}${nextPath ?? "/dashboard"}`,
      },
    });
    if (error) {
      toast({ title: `${provider} login failed`, description: error.message, variant: "destructive" });
      setOauthLoading(null);
    }
    // On success, Supabase redirects the browser — no need to navigate manually
  };

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
      goNext();
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
      goNext();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-display">
              {mode === "login" && "Sign In"}
              {mode === "signup" && "Create Account"}
              {mode === "otp-request" && "OTP Login"}
              {mode === "otp-verify" && "Verify OTP"}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {mode === "login" && "Welcome back to Samyam"}
              {mode === "signup" && "Join us today"}
              {mode === "otp-request" && "We'll send a code to your email"}
              {mode === "otp-verify" && "Enter the code from your email"}
            </p>
          </div>

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {/* OAuth Buttons */}
              <OAuthButtons oauthLoading={oauthLoading} onOAuth={handleOAuthLogin} />

              {/* Divider */}
              <OrDivider />

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

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* OAuth Buttons */}
              <OAuthButtons oauthLoading={oauthLoading} onOAuth={handleOAuthLogin} />

              {/* Divider */}
              <OrDivider />

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

// --- Reusable Sub-components ---

const OrDivider = () => (
  <div className="flex items-center gap-3 my-1">
    <div className="flex-1 h-px bg-border/50" />
    <span className="text-xs text-muted-foreground font-medium">OR</span>
    <div className="flex-1 h-px bg-border/50" />
  </div>
);

const OAuthButtons = ({
  oauthLoading,
  onOAuth,
}: {
  oauthLoading: "google" | "github" | null;
  onOAuth: (provider: "google" | "github") => void;
}) => (
  <div className="flex flex-col gap-2">
    <button
      type="button"
      id="btn-google-oauth"
      onClick={() => onOAuth("google")}
      disabled={oauthLoading !== null}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border/60 bg-background hover:bg-secondary/60 transition-colors text-sm font-medium text-foreground disabled:opacity-60"
    >
      {oauthLoading === "google" ? (
        <span className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-foreground animate-spin" />
      ) : (
        <GoogleIcon />
      )}
      Continue with Google
    </button>
    <button
      type="button"
      id="btn-github-oauth"
      onClick={() => onOAuth("github")}
      disabled={oauthLoading !== null}
      className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border/60 bg-background hover:bg-secondary/60 transition-colors text-sm font-medium text-foreground disabled:opacity-60"
    >
      {oauthLoading === "github" ? (
        <span className="h-4 w-4 rounded-full border-2 border-muted-foreground border-t-foreground animate-spin" />
      ) : (
        <GitHubIcon />
      )}
      Continue with GitHub
    </button>
  </div>
);

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
