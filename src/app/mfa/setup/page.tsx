"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { ShieldCheck } from "lucide-react";

export default function MfaSetupPage() {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingAuth, setPendingAuth] = useState<any>(null);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingAuth");
    if (!pending) {
      router.push("/login");
      return;
    }

    const data = JSON.parse(pending);
    if (!data.setupPending || !data.otpauthUrl || !data.user) {
      router.push("/login");
      return;
    }

    setPendingAuth(data);
    setSecret(data.otpauthUrl.split("secret=")[1]?.split("&")[0] ?? null);

    QRCode.toDataURL(data.otpauthUrl)
      .then(setQrDataUrl)
      .catch((err) => {
        console.error("QR code generation failed", err);
        setError("Unable to render the authenticator QR code.");
      });
  }, [router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!pendingAuth) {
        router.push("/login");
        return;
      }

      const codeDigits = code.replace(/\s/g, "");
      if (codeDigits.length < 6) {
        setError("Enter the 6-digit verification code.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/verify-mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: pendingAuth.user.id,
          code: codeDigits,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Unable to verify code. Please try again.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      sessionStorage.removeItem("pendingAuth");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-media">
        <div className="brand-lockup">
          <span className="brand-mark">A</span>
          <span>AUREXIA</span>
        </div>
        <div>
          <div className="eyebrow">Authenticator setup</div>
          <h1 style={{ maxWidth: 560, fontSize: 48, marginTop: 16 }}>Set up your authenticator app.</h1>
          <p style={{ maxWidth: 520, color: "rgba(255,255,255,0.7)", marginTop: 18 }}>
            Scan the QR code below with Google Authenticator, Authy, or another TOTP app.
          </p>
        </div>
      </section>
      <section className="auth-panel">
        <div style={{ marginBottom: 36 }}>
          <div style={{ color: "var(--emerald)", marginBottom: 18 }}><ShieldCheck size={26} /></div>
          <h1 className="auth-title">Scan the code</h1>
          <p className="auth-subtitle">Then enter the 6-digit code from your authenticator app.</p>
        </div>

        {error && <div style={{ color: "#FCA5A5", fontSize: 14, marginBottom: 16 }}>{error}</div>}

        {qrDataUrl ? (
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src={qrDataUrl} alt="Authenticator QR code" style={{ maxWidth: 280, width: "100%", borderRadius: 16, boxShadow: "0 16px 60px rgba(0,0,0,0.25)" }} />
          </div>
        ) : (
          <div style={{ color: "rgba(255,255,255,0.7)", marginBottom: 24 }}>Loading QR code...</div>
        )}

        {secret && (
          <div style={{ marginBottom: 24, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
            Secret key: <strong>{secret}</strong>
          </div>
        )}

        <form onSubmit={handleVerify}>
          <label className="auth-label">Verification code</label>
          <input
            className="auth-input"
            inputMode="numeric"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="000000"
            style={{ fontSize: 28, letterSpacing: 8, textAlign: "center", marginBottom: 22 }}
            disabled={loading}
          />
          <button
            className="btn btn-blue btn-lg"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify and continue"}
          </button>
        </form>
      </section>
    </main>
  );
}
