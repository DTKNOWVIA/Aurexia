"use client";

import { FolderPlus, ShieldCheck, Upload } from "lucide-react";
import DashboardShell from "@/components/DashboardShell";

export default function DataRoomsPage() {
  return (
    <DashboardShell
      active="Data Rooms"
      title="Data Rooms"
      subtitle="Create transaction rooms, manage folders, permissions, versioning, Q&A, and access logs."
      action={<button className="btn btn-blue"><FolderPlus size={16} /> New room</button>}
    >
      <div className="workspace-grid">
        <section className="card">
          <h2>Room creation wizard</h2>
          <div className="form-grid" style={{ marginTop: 18 }}>
            <input className="input" placeholder="Room name" />
            <input className="input" placeholder="Related asset" />
            <select className="input" defaultValue="Fund-level">
              <option>Fund-level</option>
              <option>Transaction-level</option>
              <option>LP portal</option>
            </select>
            <input className="input" placeholder="Permission expiry" />
          </div>
          <button className="btn btn-blue" style={{ marginTop: 12 }}><ShieldCheck size={16} /> Configure permissions</button>
        </section>
        <section className="card">
          <h2>Document preview and activity</h2>
          <div className="document-preview"><Upload size={36} /><span>Upload documents or preview versions in browser</span></div>
          <table className="table" style={{ marginTop: 16 }}>
            <tbody>
              {[
                ["Apex LP", "Viewed memo", "10:14"],
                ["Legal Admin", "Uploaded v2", "09:42"],
                ["IC Member", "Commented in Q&A", "Yesterday"],
              ].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardShell>
  );
}
