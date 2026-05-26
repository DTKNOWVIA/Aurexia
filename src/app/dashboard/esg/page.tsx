"use client";

import { Leaf } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export default function ESGDashboardPage() {
  return (
    <DashboardShell active="ESG" title="ESG & Compliance" subtitle="Manage ESG assessments, action plans, incidents, audit logs, and report readiness.">
      <div className="workspace-grid">
        <section className="card">
          <h2>ESG assessment</h2>
          {["Environmental controls", "Community engagement", "Governance policies", "Health and safety"].map((label, index) => (
            <div className="input-group" key={label}>
              <label className="input-label">{label}</label>
              <input type="range" min="0" max="100" defaultValue={72 + index * 5} />
            </div>
          ))}
          <button className="btn btn-blue"><Leaf size={16} /> Save assessment</button>
        </section>
        <section className="card">
          <h2>Audit-ready action tracker</h2>
          <table className="table" style={{ marginTop: 16 }}>
            <thead><tr><th>Action</th><th>Owner</th><th>Status</th></tr></thead>
            <tbody>
              {[
                ["Water monitoring plan", "ESG Officer", "Open"],
                ["Community MOU evidence", "Operator", "Review"],
                ["Board policy pack", "Compliance", "Closed"],
              ].map((row) => <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td><span className="badge badge-green">{row[2]}</span></td></tr>)}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardShell>
  );
}
