"use client";

import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import PublicNav from "@/components/PublicNav";

const nodes = [
  ["DRC Copperbelt", "62%", "38%", "Copper", "DRC", "Copper and cobalt"],
  ["Zambia", "55%", "48%", "Copper", "Zambia", "Copper expansion"],
  ["Zimbabwe", "48%", "58%", "Lithium", "Zimbabwe", "Lithium and PGMs"],
  ["Botswana", "44%", "69%", "Nickel", "Botswana", "Nickel and copper"],
  ["South Africa", "57%", "77%", "Manganese", "South Africa", "PGMs and manganese"],
  ["Namibia", "33%", "62%", "Rare earths", "Namibia", "Uranium and rare earths"],
];

export default function MapPage() {
  const [commodity, setCommodity] = useState("All");
  const [country, setCountry] = useState("All");
  const visibleNodes = useMemo(
    () => nodes.filter((node) => (commodity === "All" || node[3] === commodity) && (country === "All" || node[4] === country)),
    [commodity, country]
  );

  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band section-dark">
        <div className="section-inner">
          <div className="section-kicker" style={{ color: "var(--copper-bronze)" }}>Regional map</div>
          <h1 className="section-title">Pipeline visibility across Southern Africa.</h1>
          <p className="section-copy">
            The map view frames where the platform tracks assets, local partners, infrastructure corridors, and
            diligence priorities.
          </p>
          <div className="toolbar-row dark-toolbar">
            <select className="input" value={commodity} onChange={(e) => setCommodity(e.target.value)}>
              {["All", "Copper", "Lithium", "Nickel", "Manganese", "Rare earths"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
              {["All", "DRC", "Zambia", "Zimbabwe", "Botswana", "South Africa", "Namibia"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="map-panel" aria-label="Southern Africa asset focus map">
            {visibleNodes.map(([name, left, top, , , detail]) => (
              <div key={name}>
                <span className="map-node" style={{ left, top }} />
                <span className="map-label" style={{ left, top }}>
                  {name}
                  <span style={{ display: "block", color: "rgba(255,255,255,0.52)", fontWeight: 600 }}>{detail}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-band">
        <div className="section-inner">
          <div className="feature-grid">
            {["Jurisdiction risk", "Infrastructure access", "Commodity thesis"].map((title) => (
              <article className="feature-card" key={title}>
                <div style={{ color: "var(--emerald)" }}><MapPin size={22} /></div>
                <h3>{title}</h3>
                <p>Track the regional inputs that matter before a deal enters diligence or investment committee review.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
