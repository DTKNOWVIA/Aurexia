"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";

export default function MfaPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    const pending = sessionStorage.getItem("pendingAuth");
    if (!pending) {
      router.push("/login");
      return;
    }
    if (code.replace(/\s/g, "").length < 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }
    const data = JSON.parse(pending);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    sessionStorage.removeItem("pendingAuth");
    router.push("/dashboard");
  }

  return (
    <main className="auth-shell">
      <section className="auth-media">
        <div className="brand-lockup">
          <span className="brand-mark">A</span>
          <span>AUREXIA</span>
        </div>
        <div>
          <div className="eyebrow">Multi-factor authentication</div>
          <h1 style={{ maxWidth: 560, fontSize: 48, marginTop: 16 }}>Verify your secure session.</h1>
          <p style={{ maxWidth: 520, color: "rgba(255,255,255,0.7)", marginTop: 18 }}>
            This extra step protects LP records, deal materials, and committee workflows.
          </p>
        </div>
      </section>
      <section className="auth-panel">
        <div style={{ marginBottom: 36 }}>
          <div style={{ color: "var(--emerald)", marginBottom: 18 }}><ShieldCheck size={26} /></div>
          <h1 className="auth-title">Enter MFA code</h1>
          <p className="auth-subtitle">Use the 6-digit code from your authenticator app.</p>
        </div>
        {error && <div style={{ color: "#FCA5A5", fontSize: 14, marginBottom: 16 }}>{error}</div>}
        <form onSubmit={handleVerify}>
          <label className="auth-label">Verification code</label>
          <input className="auth-input" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000" style={{ fontSize: 28, letterSpacing: 8, textAlign: "center", marginBottom: 22 }} />
          <button className="btn btn-blue btn-lg" style={{ width: "100%" }}>Verify and continue</button>
        </form>
      </section>
    </main>
  );
}
