"use client";

import { Search } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

const results = [
  ["Document", "Kariba Lithium IC memo", "IC Memos"],
  ["Asset", "Limpopo Graphite", "Origination"],
  ["Investor", "Apex Pension Trust", "LP CRM"],
  ["Report", "Q1 ESG report", "Reports"],
];

export default function SearchPage() {
  return (
    <DashboardShell active="Search" title="Global Search" subtitle="Search across documents, assets, investors, reports, and comments.">
      <section className="card">
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: 14, top: 13, color: "var(--gray-400)" }} />
          <input className="input" placeholder="Search documents, assets, LPs, reports..." style={{ paddingLeft: 42 }} />
        </div>
        <table className="table" style={{ marginTop: 20 }}>
          <thead><tr><th>Type</th><th>Name</th><th>Area</th></tr></thead>
          <tbody>
            {results.map((row) => <tr key={row[1]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
          </tbody>
        </table>
      </section>
    </DashboardShell>
  );
}
