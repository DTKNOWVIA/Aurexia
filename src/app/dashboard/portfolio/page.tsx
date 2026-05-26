"use client";

import DashboardShell from "@/components/DashboardShell";

export default function PortfolioDashboardPage() {
  return (
    <DashboardShell active="Portfolio" title="Portfolio Management" subtitle="Track NAV, IRR, MOIC, EBITDA, production, costs, and transformation actions.">
      <div className="stats-grid">
        {[
          ["$184M", "NAV"],
          ["21.2%", "Net IRR"],
          ["2.0x", "MOIC"],
          ["$12.8M", "Cash yield"],
        ].map(([value, label]) => (
          <div className="stat-card" key={label}><div className="stat-value">{value}</div><div className="stat-label">{label}</div></div>
        ))}
      </div>
      <div className="workspace-grid" style={{ marginTop: 24 }}>
        <section className="card">
          <h2>Asset KPI dashboard</h2>
          <table className="table" style={{ marginTop: 16 }}>
            <thead><tr><th>Asset</th><th>EBITDA</th><th>Production</th><th>Budget vs actual</th></tr></thead>
            <tbody>
              {[
                ["Kariba Lithium", "$8.4M", "92%", "+4%"],
                ["Limpopo Graphite", "$3.9M", "81%", "-2%"],
                ["Copperbelt Tailings", "$5.1M", "88%", "+1%"],
              ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </section>
        <section className="card">
          <h2>Value creation actions</h2>
          {["Governance reset", "Cost reduction plan", "Offtake negotiation", "ESG incident closure"].map((item) => (
            <div className="check-row" key={item}><span className="badge badge-green">On track</span>{item}</div>
          ))}
        </section>
      </div>
    </DashboardShell>
  );
}
