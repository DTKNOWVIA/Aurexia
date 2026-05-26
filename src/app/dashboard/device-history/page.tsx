"use client";

import DashboardShell from "@/components/DashboardShell";

export default function DeviceHistoryPage() {
  return (
    <DashboardShell active="Device History" title="Session & Device History" subtitle="Display session timeout state, device history, and recent secure access events.">
      <div className="workspace-grid">
        <section className="card">
          <h2>Active session</h2>
          <div className="check-row"><span className="badge badge-green">Active</span> Current browser session</div>
          <div className="check-row"><span className="badge badge-blue">Timeout</span> 7 days token expiry configured</div>
          <div className="check-row"><span className="badge badge-gray">MFA</span> Verification prompt supported</div>
        </section>
        <section className="card">
          <h2>Device history</h2>
          <table className="table" style={{ marginTop: 16 }}>
            <thead><tr><th>Device</th><th>Location</th><th>Last seen</th></tr></thead>
            <tbody>
              {[
                ["Chrome on Windows", "Johannesburg", "Now"],
                ["Safari on iPad", "Sandton", "Yesterday"],
                ["Edge on Windows", "Cape Town", "May 12, 2026"],
              ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardShell>
  );
}
