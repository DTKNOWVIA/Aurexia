"use client";

import { Filter, Send } from "lucide-react";
import { useMemo, useState } from "react";
import PublicNav from "@/components/PublicNav";

const assets = [
  { name: "Copperbelt Tailings", country: "Zambia", commodity: "Copper", stage: "Screening", capital: "$18M", score: 82 },
  { name: "Limpopo Graphite", country: "South Africa", commodity: "Graphite", stage: "Diligence", capital: "$24M", score: 76 },
  { name: "Kariba Lithium", country: "Zimbabwe", commodity: "Lithium", stage: "IC-ready", capital: "$36M", score: 88 },
  { name: "Kalahari Manganese", country: "Botswana", commodity: "Manganese", stage: "Sourced", capital: "$14M", score: 69 },
  { name: "Tete Vanadium", country: "Mozambique", commodity: "Vanadium", stage: "Screening", capital: "$21M", score: 73 },
];

export default function PipelinePage() {
  const [commodity, setCommodity] = useState("All");
  const [country, setCountry] = useState("All");

  const filtered = useMemo(
    () =>
      assets.filter(
        (asset) =>
          (commodity === "All" || asset.commodity === commodity) &&
          (country === "All" || asset.country === country)
      ),
    [commodity, country]
  );

  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band section-dark">
        <div className="section-inner">
          <div className="section-kicker" style={{ color: "var(--copper-bronze)" }}>Pipeline teaser</div>
          <h1 className="section-title">Proprietary Pipeline of Critical Mineral Assets</h1>
          <p className="section-copy">
            Non-sensitive visibility into Aurexia&apos;s origination engine, with search logic shaped around commodity,
            country, stage, capital need, and readiness scoring.
          </p>
        </div>
      </section>

      <section className="section-band">
        <div className="section-inner">
          <div className="toolbar-row">
            <div className="toolbar-title"><Filter size={18} /> Filter pipeline</div>
            <select className="input" value={commodity} onChange={(e) => setCommodity(e.target.value)}>
              {["All", "Lithium", "Copper", "Graphite", "Manganese", "Vanadium"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
              {["All", "South Africa", "Zimbabwe", "Zambia", "Botswana", "Mozambique"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>

          <div className="asset-grid">
            {filtered.map((asset) => (
              <article className="feature-card" key={asset.name}>
                <div className="badge badge-blue">{asset.stage}</div>
                <h3>{asset.name}</h3>
                <p>{asset.country} · {asset.commodity} · {asset.capital} capital need</p>
                <div className="score-track"><span style={{ width: `${asset.score}%` }} /></div>
                <div className="metric-label" style={{ color: "var(--gray-600)" }}>{asset.score}/100 readiness score</div>
              </article>
            ))}
          </div>

          <div className="split-panel" style={{ marginTop: 32 }}>
            <div>
              <div className="section-kicker">Origination flow</div>
              <h2>Submit a Project</h2>
              <p>Operators can share commodity, location, stage, and capital need so the asset can enter the pipeline CRM.</p>
            </div>
            <form className="public-form compact-form">
              <input className="input" placeholder="Project name" />
              <input className="input" placeholder="Commodity" />
              <input className="input" placeholder="Location" />
              <input className="input" placeholder="Capital need" />
              <select className="input" defaultValue="Producing">
                <option>Producing</option>
                <option>Near-producing</option>
                <option>Restart</option>
                <option>Development</option>
              </select>
              <button type="button" className="btn btn-blue"><Send size={16} /> Submit project</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
