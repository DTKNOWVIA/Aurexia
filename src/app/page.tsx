"use client";

import { ArrowRight, BarChart3, Download, Globe2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";

export default function Home() {
  return (
    <main className="public-shell">
      <PublicNav />
      <section className="hero-section">
        <div className="hero-inner">
          <div className="eyebrow">Institutional critical minerals platform</div>
          <h1 className="hero-title">From Ore to Institutional Returns</h1>
          <p className="hero-copy">
            Aurexia is a Southern Africa-focused capital platform transforming critical mineral assets into
            institutional-grade investments aligned with global energy transition demand.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="btn btn-blue btn-lg">
              Request Investor Access <ArrowRight size={18} />
            </Link>
            <Link href="/investor" className="btn btn-outline btn-lg" style={{ color: "white", borderColor: "rgba(255,255,255,0.32)" }}>
              Explore Platform
            </Link>
          </div>
          <div className="metric-strip">
            {[
              ["$300M", "Target Fund"],
              ["200+", "Pipeline Assets"],
              ["8-12", "Portfolio Assets"],
              ["18-22%", "Target IRR"],
            ].map(([value, label]) => (
              <div className="metric-item" key={label}>
                <div className="metric-value">{value}</div>
                <div className="metric-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-inner">
          <div className="section-kicker">Operating system</div>
          <h2 className="section-title">A New Model for Mining Investment</h2>
          <p className="section-copy">
            Aurexia operates at the intersection of geology, capital, and execution. We do not simply invest in mines;
            we institutionalise them through a connected capital interface and execution engine.
          </p>
          <div className="feature-grid">
            {[
              [<Globe2 size={22} key="icon" />, "Proprietary pipeline", "Structured deal flow across Southern Africa with country, commodity, and stage visibility."],
              [<ShieldCheck size={22} key="icon" />, "Institutional governance", "NDA-gated investor materials, RBAC, IC workflows, audit logs, and controlled data rooms."],
              [<BarChart3 size={22} key="icon" />, "Structured returns", "Equity, debt, and offtake capital design with IRR simulation and value creation tracking."],
            ].map(([icon, title, copy]) => (
              <article className="feature-card" key={String(title)}>
                <div style={{ color: "var(--blue)" }}>{icon}</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band section-dark">
        <div className="section-inner">
          <div className="section-kicker" style={{ color: "var(--copper-bronze)" }}>Return pathway</div>
          <h2 className="section-title">A Disciplined Path to 20%+ Returns</h2>
          <div className="process-grid">
            {[
              "Entry at discounted multiples",
              "Operational and governance improvement",
              "Cash yield through structured capital",
              "Exit at institutional multiples",
            ].map((step, index) => (
              <article className="process-card" key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step}</h3>
              </article>
            ))}
          </div>
          <div className="section-actions">
            <Link href="/pipeline" className="btn btn-blue">View pipeline teaser</Link>
            <Link href="/contact" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.28)" }}>
              <Download size={16} /> Download memo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
