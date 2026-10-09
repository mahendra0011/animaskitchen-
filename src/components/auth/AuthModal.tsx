import React, { useState, useEffect } from "react";
import { useDemoStore } from "@/context/DemoStoreContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Lock,
  User,
  Phone,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  Shield,
  Bike,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, authModalTab, setIsAuthenticated, loginAsRole } =
    useDemoStore();

  const [mode, setMode] = useState<
    "login" | "signup" | "verify_email" | "forgot_password" | "reset_password"
  >("login");

  // Sync mode whenever authModalTab changes (e.g. from clicking Sign In vs Create Account)
  useEffect(() => {
    if (authModalTab) {
      setMode(authModalTab);
    }
  }, [authModalTab, authModalOpen]);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // 1. SIGNUP: Name, Email, Contact Number, Password -> Triggers Email Verification OTP
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service & Privacy Policy to create an account.");
      return;
    }
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      toast.error("Please fill in all registration fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "Verification code sent to your email!");
        setMode("verify_email");
        startCooldown();
      } else {
        toast.error(data.error || "Signup failed.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. ONE-TIME EMAIL VERIFICATION
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit code received on your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Account verified! Welcome, ${data.user?.name || "Customer"}!`);
        setIsAuthenticated(true);
        setAuthModalOpen(false);
        resetForm();
      } else {
        toast.error(data.error || "Invalid verification code.");
      }
    } catch {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 3. LOGIN: Email & Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Signed in successfully! Welcome back ${data.user?.name || ""}`);
        setIsAuthenticated(true);
        if (data.user?.role) {
          loginAsRole(data.user.role, { identifier: data.user.email });
        }
        setAuthModalOpen(false);
        resetForm();
      } else if (data.error === "EMAIL_NOT_VERIFIED") {
        toast.info("Please verify your email address. We sent a new 6-digit code.");
        setMode("verify_email");
        startCooldown();
      } else {
        toast.error(data.error || "Invalid email or password.");
      }
    } catch {
      toast.error("Login failed. Check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  // 3.1 GOOGLE SIGN IN
  // 3.1 GOOGLE SIGN IN (Opens genuine Google Account Chooser Popup)
  const handleGoogleSignIn = async () => {
    const clientId =
      (import.meta.env as Record<string, string>)["VITE_GOOGLE_CLIENT_ID"] ||
      "345998307885-p2l0rn1hhslnnkbm1381f2adu3u6m3gn.apps.googleusercontent.com";

    setLoading(true);

    // 1. Try Google Identity Services Token Client if available in window
    if (typeof (window as any).google !== "undefined" && (window as any).google.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: "email profile openid",
          prompt: "select_account",
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setLoading(false);
              toast.error(`Google login error: ${tokenResponse.error}`);
              return;
            }

            try {
              // Fetch user profile directly from Google with the access token
              const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const googleProfile = await userInfoRes.json();

              if (!googleProfile.email) {
                toast.error("Could not fetch email from selected Google account.");
                setLoading(false);
                return;
              }

              // Send to backend to create or resume session
              // accessToken is verified server-side via Google userinfo (anti-spoofing).
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  accessToken: tokenResponse.access_token,
                  userInfo: {
                    email: googleProfile.email,
                    name: googleProfile.name || googleProfile.given_name || "Google User",
                    picture: googleProfile.picture,
                    sub: googleProfile.sub,
                  },
                }),
              });
              const data = await res.json();
              if (res.ok && data.success) {
                toast.success(`Signed in as ${googleProfile.email}!`);
                setIsAuthenticated(true);
                if (data.user?.role) {
                  loginAsRole(data.user.role, { identifier: data.user.email });
                }
                setAuthModalOpen(false);
                resetForm();
              } else {
                toast.error(data.error || "Google login failed on server.");
              }
            } catch {
              toast.error("Failed to connect to Google account service.");
            } finally {
              setLoading(false);
            }
          },
        });

        // Triggers the genuine Google "Choose an account" dialog
        client.requestAccessToken({ prompt: "select_account" });
        return;
      } catch (err) {
        console.warn("Google oauth2 client init error, falling back to popup flow:", err);
      }
    }

    // 2. Fallback: Open Google OAuth popup window directly
    try {
      const redirectUri = window.location.origin;
      const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        clientId,
      )}&redirect_uri=${encodeURIComponent(
        redirectUri,
      )}&response_type=token&scope=${encodeURIComponent(
        "email profile openid",
      )}&prompt=select_account`;

      const popup = window.open(
        oauthUrl,
        "google_auth_popup",
        "width=500,height=600,menubar=no,toolbar=no,location=no,status=no",
      );

      if (!popup) {
        toast.error("Popup was blocked by your browser. Please allow popups for localhost.");
        setLoading(false);
        return;
      }

      // Listen for popup redirect hash token
      const checkPopup = setInterval(async () => {
        try {
          if (!popup || popup.closed) {
            clearInterval(checkPopup);
            setLoading(false);
            return;
          }

          if (popup.location.href.includes(window.location.origin)) {
            const hash = popup.location.hash;
            if (hash && hash.includes("access_token")) {
              clearInterval(checkPopup);
              popup.close();

              const params = new URLSearchParams(hash.substring(1));
              const accessToken = params.get("access_token");

              if (accessToken) {
                const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${accessToken}` },
                });
                const googleProfile = await userInfoRes.json();

                if (googleProfile.email) {
                  const res = await fetch("/api/auth/google", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      accessToken,
                      userInfo: {
                        email: googleProfile.email,
                        name: googleProfile.name || "Google User",
                        picture: googleProfile.picture,
                        sub: googleProfile.sub,
                      },
                    }),
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    toast.success(`Signed in as ${googleProfile.email}!`);
                    setIsAuthenticated(true);
                    if (data.user?.role) {
                      loginAsRole(data.user.role, { identifier: data.user.email });
                    }
                    setAuthModalOpen(false);
                    resetForm();
                  }
                }
              }
              setLoading(false);
            }
          }
        } catch {
          // Cross-origin access while still on accounts.google.com - ignore until redirected back
        }
      }, 500);
    } catch {
      setLoading(false);
      toast.error("Could not initiate Google login popup.");
    }
  };

  // 4. FORGOT PASSWORD: Send OTP
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || "OTP code sent to your email!");
        setMode("reset_password");
        startCooldown();
      } else {
        toast.error(data.error || "Could not send reset code.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 5. RESET PASSWORD WITH OTP
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Password reset successfully! Please sign in with your new password.");
        setPassword(newPassword);
        setMode("login");
      } else {
        toast.error(data.error || "Password reset failed.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    setLoading(true);
    try {
      if (mode === "reset_password") {
        await handleForgotPasswordSubmit({ preventDefault: () => {} } as any);
      } else {
        const res = await fetch("/api/auth/resend-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success("New verification code sent!");
          startCooldown();
        }
      }
    } catch {
      toast.error("Failed to resend code.");
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetForm = () => {
    setMode("login");
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setNewPassword("");
    setOtp("");
  };

  return (
    <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto rounded-[28px] border border-spice/20 bg-gradient-to-b from-[#fbf8f1] to-[#f4ede0] p-0 shadow-2xl text-ink transition-all animate-in fade-in-90 zoom-in-95 duration-200">
        {/* Animated Brand Header */}
        <div className="relative border-b border-ink/10 bg-gradient-to-r from-cream via-[#f9f3e5] to-cream/80 p-6 overflow-hidden">
          <div className="absolute -top-12 -right-12 size-32 rounded-full bg-spice/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 size-24 rounded-full bg-saffron/15 blur-xl pointer-events-none" />

          <div className="relative flex items-center gap-3.5">
            <div className="relative grid size-11 place-items-center rounded-2xl bg-gradient-to-tr from-ink to-ink/90 font-display text-xl text-cream shadow-md shadow-ink/20 ring-2 ring-spice/20">
              <span className="font-serif">A</span>
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-leaf border-2 border-cream" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink flex items-center gap-2">
                {mode === "login" && "Sign In"}
                {mode === "signup" && "Create Account"}
                {mode === "verify_email" && "Verify Email"}
                {mode === "forgot_password" && "Reset Password"}
                {mode === "reset_password" && "Enter New Password"}
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-spice/10 text-spice font-semibold tracking-normal border border-spice/15">
                  Anima's Kitchen
                </span>
              </DialogTitle>
              <DialogDescription className="text-xs text-ink/65 mt-0.5">
                {mode === "verify_email"
                  ? `Enter the 6-digit passcode sent to ${email}`
                  : mode === "forgot_password"
                    ? "We'll send a 6-digit OTP passcode to reset your password"
                    : mode === "reset_password"
                      ? "Enter the OTP received on your email and choose a new password"
                      : "Freshly prepared homestyle food cooked with pure desi ghee"}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Navigation Pill Switcher */}
          {(mode === "login" || mode === "signup") && (
            <div className="flex rounded-2xl border border-ink/10 bg-ink/5 p-1 text-xs font-semibold shadow-inner">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 rounded-xl py-2 transition-all flex items-center justify-center gap-1.5 ${
                  mode === "login"
                    ? "bg-white text-ink shadow-md shadow-ink/5 font-bold scale-[1.01]"
                    : "text-ink/60 hover:text-ink hover:bg-white/40"
                }`}
              >
                <Lock className="size-3.5 text-spice" />
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 rounded-xl py-2 transition-all flex items-center justify-center gap-1.5 ${
                  mode === "signup"
                    ? "bg-white text-ink shadow-md shadow-ink/5 font-bold scale-[1.01]"
                    : "text-ink/60 hover:text-ink hover:bg-white/40"
                }`}
              >
                <User className="size-3.5 text-spice" />
                <span>Register</span>
              </button>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-spice" />
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="rounded-xl border-ink/20 text-xs bg-white/80 font-mono py-2.5 shadow-xs focus:bg-white focus:border-spice"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                    <Lock className="size-3.5 text-spice" />
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot_password")}
                    className="text-[11px] text-spice hover:text-ink font-semibold transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="rounded-xl border-ink/20 text-xs bg-white/80 font-mono py-2.5 pr-10 shadow-xs focus:bg-white focus:border-spice"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-spice to-[#b8380b] hover:from-ink hover:to-ink text-cream py-3 font-bold text-xs shadow-md shadow-spice/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign In & Enter"}
                {!loading && <ArrowRight className="size-3.5" />}
              </Button>

              {/* OR DIVIDER */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="w-full border-t border-ink/15" />
                <span className="absolute bg-[#f9f4ea] px-3 font-mono text-[10px] uppercase font-bold text-ink/50 tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>

              {/* GOOGLE SIGN IN BUTTON */}
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-ink/15 bg-white hover:bg-frost py-2.5 px-4 text-xs font-bold text-ink shadow-sm hover:border-spice/40 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* ONE-TAP QUICK DEMO / TESTING LOGINS */}
              <div className="pt-2 border-t border-dashed border-ink/20 space-y-2">
                <span className="block text-[10px] font-mono uppercase tracking-wider font-bold text-ink/50 text-center">
                  🛠️ Instant Testing Accounts
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsRole("admin", { identifier: "admin@animaskitchen.com" });
                      setAuthModalOpen(false);
                      toast.success("Welcome back, Master Admin!");
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-spice/10 hover:bg-spice/20 border border-spice/30 text-spice font-bold text-[11px] transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
                  >
                    <Shield className="size-3.5" />
                    <span>Demo Admin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginAsRole("delivery", { identifier: "delivery@animaskitchen.com" });
                      setAuthModalOpen(false);
                      toast.success("Welcome, Delivery Hero!");
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-800 font-bold text-[11px] transition-all hover:scale-[1.02] active:scale-95 shadow-xs"
                  >
                    <Bike className="size-3.5" />
                    <span>Demo Rider</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-ink/60">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-[11px] text-spice font-bold hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGNUP FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <User className="size-3.5 text-spice" />
                  Full Name
                </label>
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="rounded-xl border-ink/20 text-xs bg-white/80 py-2.5 shadow-xs focus:bg-white focus:border-spice"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-spice" />
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="rounded-xl border-ink/20 text-xs bg-white/80 font-mono py-2.5 shadow-xs focus:bg-white focus:border-spice"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Phone className="size-3.5 text-spice" />
                  Contact Number
                </label>
                <Input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="rounded-xl border-ink/20 text-xs bg-white/80 font-mono py-2.5 shadow-xs focus:bg-white focus:border-spice"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-spice" />
                  Set Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="rounded-xl border-ink/20 text-xs bg-white/80 font-mono py-2.5 pr-10 shadow-xs focus:bg-white focus:border-spice"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border border-spice/20 bg-spice/5 p-3 text-[11px] text-ink/75 flex items-center gap-2.5">
                <ShieldCheck className="size-4 text-spice shrink-0" />
                <span>
                  One-time 6-digit OTP code will be sent to your email to verify your account.
                </span>
              </div>

              {/* User Agreement & Legal Consent Checkbox */}
              <div className="pt-1 flex items-start gap-2.5 text-[11px] text-ink/70">
                <input
                  type="checkbox"
                  id="signup-agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-ink/30 text-spice focus:ring-spice cursor-pointer accent-[#e05320]"
                />
                <label htmlFor="signup-agree-terms" className="leading-tight cursor-pointer">
                  I agree to Anima’s Kitchen{" "}
                  <span className="font-bold text-spice underline">Terms of Service</span>,{" "}
                  <span className="font-bold text-spice underline">Privacy Policy</span>, and food
                  hygiene guidelines.
                </label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-spice to-[#b8380b] hover:from-ink hover:to-ink text-cream py-3 font-bold text-xs shadow-md shadow-spice/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Register & Send Verification Code"
                )}
                {!loading && <ArrowRight className="size-3.5" />}
              </Button>

              {/* OR DIVIDER */}
              <div className="relative my-3 flex items-center justify-center">
                <div className="w-full border-t border-ink/15" />
                <span className="absolute bg-[#f9f4ea] px-3 font-mono text-[10px] uppercase font-bold text-ink/50 tracking-wider">
                  OR CONTINUE WITH
                </span>
              </div>

              {/* GOOGLE SIGN UP / REGISTER BUTTON */}
              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 rounded-2xl border border-ink/15 bg-white hover:bg-frost py-2.5 px-4 text-xs font-bold text-ink shadow-sm hover:border-spice/40 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-ink/60">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-[11px] text-spice font-bold hover:underline"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD (EMAIL INPUT) */}
          {mode === "forgot_password" && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5 text-xs">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-ink/80 flex items-start gap-2.5">
                <HelpCircle className="size-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Enter your registered email address. We will send a secure 6-digit OTP code to
                  verify and reset your password.
                </span>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-spice" />
                  Your Account Email
                </label>
                <Input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="rounded-xl border-ink/20 text-xs bg-white/80 font-mono py-2.5 shadow-xs focus:bg-white focus:border-spice"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !email}
                className="w-full rounded-2xl bg-gradient-to-r from-spice to-[#b8380b] hover:from-ink hover:to-ink text-cream py-3 font-bold text-xs shadow-md shadow-spice/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Send Reset Code via Email"
                )}
                {!loading && <ArrowRight className="size-3.5" />}
              </Button>

              <button
                type="button"
                onClick={() => setMode("login")}
                className="w-full text-center text-xs text-ink/60 hover:text-ink font-semibold py-1"
              >
                ← Back to Sign In
              </button>
            </form>
          )}

          {/* 4. RESET PASSWORD (OTP + NEW PASSWORD) */}
          {mode === "reset_password" && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                    <KeyRound className="size-3.5 text-spice" />
                    Enter 6-Digit OTP Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("forgot_password")}
                    className="text-[10px] text-spice underline hover:text-ink"
                  >
                    Change Email
                  </button>
                </div>
                <Input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="rounded-xl border-ink/20 text-center tracking-widest text-lg font-bold bg-white/90 py-2.5 font-mono focus:border-spice"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                  <Lock className="size-3.5 text-spice" />
                  Enter New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password (min 6 chars)"
                    className="rounded-xl border-ink/20 text-xs bg-white/80 font-mono py-2.5 pr-10 shadow-xs focus:bg-white focus:border-spice"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6 || newPassword.length < 6}
                className="w-full rounded-2xl bg-gradient-to-r from-spice to-[#b8380b] hover:from-ink hover:to-ink text-cream py-3 font-bold text-xs shadow-md shadow-spice/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Reset & Save Password"}
                {!loading && <CheckCircle2 className="size-4" />}
              </Button>

              <div className="text-center pt-1">
                {cooldown > 0 ? (
                  <span className="text-[11px] text-ink/50 font-mono">
                    Resend code in {cooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResendCode}
                    className="text-[11px] text-spice hover:text-ink font-semibold flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw className="size-3" />
                    Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* 5. VERIFY EMAIL FORM (AFTER SIGNUP) */}
          {mode === "verify_email" && (
            <form onSubmit={handleVerifyEmail} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-[10px] uppercase font-bold text-ink/70 flex items-center gap-1.5">
                    <KeyRound className="size-3 text-spice" />
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-[10px] text-spice underline hover:text-ink"
                  >
                    Change details
                  </button>
                </div>
                <Input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="rounded-xl border-ink/20 text-center tracking-widest text-lg font-bold bg-white/90 py-2.5 font-mono focus:border-spice focus:ring-spice/20"
                />
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full rounded-2xl bg-gradient-to-r from-spice to-[#b8380b] hover:from-ink hover:to-ink text-cream py-3 font-bold text-xs shadow-md shadow-spice/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Verify Email & Complete"}
                {!loading && <CheckCircle2 className="size-4" />}
              </Button>

              <div className="text-center pt-1">
                {cooldown > 0 ? (
                  <span className="text-[11px] text-ink/50 font-mono">
                    Resend code in {cooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleResendCode}
                    className="text-[11px] text-spice hover:text-ink font-semibold flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw className="size-3" />
                    Resend Verification Code
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
