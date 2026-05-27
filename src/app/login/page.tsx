"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  LockKeyhole,
  Mail,
  ShieldCheck,
  
} from "lucide-react";

type AuthMode = "login" | "signup";

const roleOptions = [
  { value: "LP", label: "Limited Partner" },
  { value: "OPERATOR", label: "Operating Partner" },
  { value: "ADVISOR", label: "Advisor" },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("LP");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    return score;
  }, [password]);

  const strengthLabel = ["Too short", "Basic", "Good", "Strong", "Excellent"][passwordScore];

  async function continueToMfa(loginEmail = email, loginPassword = password) {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail.trim(), password: loginPassword }),
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }

    sessionStorage.setItem("pendingAuth", JSON.stringify(data));
    router.push("/mfa");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await continueToMfa();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        return;
      }

      sessionStorage.setItem("pendingAuth", JSON.stringify(data));
      setSuccess("Account created. Opening authenticator setup...");
      router.push("/mfa/setup");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError("");
    setSuccess("");
  }

  const isSignup = mode === "signup";

  return (
    <main className="auth-shell">
      <section className="auth-media">
        <Link href="/" className="brand-lockup" aria-label="Aurexia home">
          <span className="brand-mark">A</span>
          <span>AUREXIA</span>
        </Link>

        <div className="auth-media-copy">
          <div className="eyebrow">Secure institutional access</div>
          <h1>Critical minerals intelligence, diligence, and execution in one workspace.</h1>
          <p>
            Access investor materials, portfolio workflows, IC memos, asset scoring, and controlled data rooms with MFA
            verification.
          </p>
        </div>

        <div className="auth-proof-grid" aria-label="Platform safeguards">
          {["MFA protected", "Role based access", "Audit logged"].map((item) => (
            <div className="auth-proof-item" key={item}>
              <ShieldCheck size={16} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <Link href="/" className="brand-lockup" aria-label="Aurexia home">
              <span className="brand-mark">A</span>
              <span>AUREXIA</span>
            </Link>
          </div>

          <div className="auth-heading">
            <div className="auth-icon">{isSignup ? <span className="inline-icon">👤</span> : <LockKeyhole size={22} />}</div>
            <div>
              <h1 className="auth-title">{isSignup ? "Create your account" : "Welcome back"}</h1>
              <p className="auth-subtitle">
                {isSignup
                  ? "Request access to the Aurexia platform."
                  : "Sign in to continue to your Aurexia workspace."}
              </p>
            </div>
          </div>

          <div className="auth-tabs" role="tablist" aria-label="Authentication mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isSignup}
              className={!isSignup ? "active" : ""}
              onClick={() => switchMode("login")}
            >
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isSignup}
              className={isSignup ? "active" : ""}
              onClick={() => switchMode("signup")}
            >
              Sign up
            </button>
          </div>

          {error && <div className="auth-alert auth-alert-error">{error}</div>}
          {success && <div className="auth-alert auth-alert-success">{success}</div>}

          <form onSubmit={isSignup ? handleSignup : handleLogin} className="auth-form">
            <div>
              <label className="auth-label" htmlFor="email">
                Email address
              </label>
              <div className="auth-field">
                <Mail size={17} />
                <input
                  id="email"
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="auth-label" htmlFor="role">
                  Account type
                </label>
                <select id="role" className="auth-input auth-select" value={role} onChange={(e) => setRole(e.target.value)}>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <div className="auth-label-row">
                <label className="auth-label" htmlFor="password">
                  Password
                </label>
                {!isSignup && (
                  <Link href="/contact" className="auth-link">
                    Need help?
                  </Link>
                )}
              </div>
              <div className="auth-field">
                <LockKeyhole size={17} />
                <input
                  id="password"
                  className="auth-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "Create a password" : "Enter your password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  required
                />
                <button
                  type="button"
                  className="auth-icon-button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                   {showPassword ? <span className="inline-icon">👁️</span> : <Eye size={17} />}
                </button>
              </div>
              {isSignup && (
                <div className="password-meter" aria-label={`Password strength: ${strengthLabel}`}>
                  <div className="password-meter-bars">
                    {[0, 1, 2, 3].map((index) => (
                      <span key={index} className={index < passwordScore ? "active" : ""} />
                    ))}
                  </div>
                  <span>{strengthLabel}</span>
                </div>
              )}
            </div>

            {isSignup && (
              <div>
                <label className="auth-label" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <div className="auth-field">
                  <CheckCircle2 size={17} />
                  <input
                    id="confirmPassword"
                    className="auth-input"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-blue btn-lg auth-submit">
              {loading ? (isSignup ? "Creating account..." : "Checking credentials...") : isSignup ? "Create account" : "Continue"}
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="auth-footnote">
            {isSignup
              ? "Internal team accounts are still created by Super Admin invite."
              : "Protected by password and MFA verification."}
          </p>
        </div>
      </section>
    </main>
  );
}
