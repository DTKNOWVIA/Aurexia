"use client";

import { CheckCircle2, Leaf, ShieldCheck } from "lucide-react";
import PublicNav from "@/components/PublicNav";

export default function ESGPage() {
  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band section-dark">
        <div className="section-inner">
          <div className="section-kicker" style={{ color: "var(--emerald)" }}>ESG</div>
          <h1 className="section-title">Operational ESG, Not Box-Ticking</h1>
          <p className="section-copy">
            Aurexia embeds ESG into operations, governance, value creation, audit readiness, and LP reporting.
          </p>
        </div>
      </section>
      <section className="section-band">
        <div className="section-inner">
          <div className="feature-grid">
            {[
              [<Leaf size={22} key="i" />, "ESG scoring", "Commercial, technical, and ESG readiness are measured as part of screening."],
              [<CheckCircle2 size={22} key="i" />, "Action tracking", "Responsible owners, deadlines, and improvement plans move assets toward institutional quality."],
              [<ShieldCheck size={22} key="i" />, "Audit logs", "Controls and evidence are built for diligence, LP confidence, and regulator review."],
            ].map(([icon, title, copy]) => (
              <article className="feature-card" key={String(title)}>
                <div style={{ color: "var(--emerald)" }}>{icon}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
