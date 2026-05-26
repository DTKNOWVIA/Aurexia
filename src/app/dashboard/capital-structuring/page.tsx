"use client";

import { Calculator, Download } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export default function CapitalStructuringPage() {
  return (
    <DashboardShell
      active="Capital Structuring"
      title="Capital Structuring"
      subtitle="Model equity, debt, offtake, IRR, sensitivity, and waterfall outputs for IC decisions."
      action={<button className="btn btn-blue"><Download size={16} /> Export to IC memo</button>}
    >
      <div className="workspace-grid">
        <section className="card">
          <h2>Capital stack builder</h2>
          <div className="form-grid" style={{ marginTop: 18 }}>
            {["Mine profile", "Entry EBITDA", "Equity layer", "Debt layer", "Offtake prepay", "Exit multiple"].map((label) => (
              <div className="input-group" key={label}>
                <label className="input-label">{label}</label>
                <input className="input" placeholder={label === "Exit multiple" ? "6.0x" : "$25M"} />
              </div>
            ))}
          </div>
          <button className="btn btn-blue"><Calculator size={16} /> Run IRR simulation</button>
        </section>
        <section className="card">
          <h2>Scenario comparison</h2>
          <table className="table" style={{ marginTop: 16 }}>
            <thead><tr><th>Scenario</th><th>IRR</th><th>MOIC</th><th>Risk</th></tr></thead>
            <tbody>
              {[
                ["Base", "20.4%", "2.1x", "Balanced"],
                ["Debt-heavy", "23.1%", "2.3x", "Higher"],
                ["Offtake-led", "18.8%", "1.9x", "Lower"],
              ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </section>
        <section className="card full-span">
          <h2>Waterfall outputs</h2>
          <div className="waterfall">
            {["LP preferred return", "Debt service", "Operating cash yield", "GP carry", "Exit proceeds"].map((item, index) => (
              <div key={item} style={{ height: `${58 + index * 18}px` }}><span>{item}</span></div>
            ))}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
