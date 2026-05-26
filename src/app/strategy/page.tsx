"use client";

import { CheckCircle2, Compass, Landmark, Pickaxe } from "lucide-react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";

export default function StrategyPage() {
  const pillars = [
    ["Critical minerals", "Copper, lithium, graphite, nickel, and rare earth exposure aligned to industrial demand."],
    ["Southern Africa", "Regional focus with country-by-country permitting, infrastructure, and sovereign risk discipline."],
    ["Institutional controls", "Investment committee memos, document governance, access logs, and task accountability."],
  ];

  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band section-dark">
        <div className="section-inner">
          <div className="section-kicker" style={{ color: "var(--copper-bronze)" }}>Strategy</div>
          <h1 className="section-title">A focused capital strategy for critical mineral value creation.</h1>
          <p className="section-copy">
            Aurexia prioritizes high-conviction, diligence-ready mineral opportunities where geology, infrastructure,
            governance, and LP appetite can be tracked in a single institutional workflow.
          </p>
          <div className="section-actions">
            <Link href="/map" className="btn btn-blue">Explore regional map</Link>
            <Link href="/contact" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.28)" }}>Contact team</Link>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-inner">
          <div className="feature-grid">
            {pillars.map(([title, copy], index) => {
              const icons = [<Pickaxe size={22} key="pickaxe" />, <Compass size={22} key="compass" />, <Landmark size={22} key="landmark" />];
              return (
                <article className="feature-card" key={title}>
                  <div style={{ color: index === 1 ? "var(--bronze)" : "var(--blue)" }}>{icons[index]}</div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              );
            })}
          </div>
          <div className="card" style={{ marginTop: 28 }}>
            {["Screen assets by commodity, stage, jurisdiction, and infrastructure path.", "Qualify LPs by mandate, ticket size, geography, and diligence stage.", "Move deals through origination, screening, diligence, IC, and close with visible ownership."].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid var(--gray-100)" }}>
                <CheckCircle2 size={18} color="var(--emerald)" />
                <span style={{ fontWeight: 650 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
