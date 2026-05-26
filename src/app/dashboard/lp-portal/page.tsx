"use client";

import { Download } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export default function LPPortalPage() {
  return (
    <DashboardShell active="LP Portal" title="LP Portal" subtitle="Investor-specific transparency for performance, reports, capital calls, notices, and documents.">
      <div className="stats-grid">
        {[
          ["21.2%", "IRR"],
          ["2.0x", "MOIC"],
          ["$184M", "NAV"],
          ["$6.3M", "Distributions"],
        ].map(([value, label]) => (
          <div className="stat-card" key={label}><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
        ))}
      </div>
      <div className="workspace-grid" style={{ marginTop: 24 }}>
        <section className="card">
          <h2>Portfolio breakdown</h2>
          <div className="allocation-bars">
            {[
              ["Lithium", 38],
              ["Copper", 24],
              ["Graphite", 18],
              ["Manganese", 20],
            ].map(([label, value]) => (
              <div key={label}><span>{label}</span><div><i style={{ width: `${value}%` }} /></div></div>
            ))}
          </div>
        </section>
        <section className="card">
          <h2>Download center</h2>
          {["Q1 quarterly report", "Capital call notice", "Financial statements", "Asset-level summary"].map((item) => (
            <button className="download-row" key={item}><Download size={16} /> {item}</button>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}
