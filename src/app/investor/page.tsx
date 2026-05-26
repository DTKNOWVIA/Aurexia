"use client";

import { Calendar, Eye, FileText, LockKeyhole, MessageSquare, ShieldCheck } from "lucide-react";
import Link from "next/link";
import PublicNav from "@/components/PublicNav";

const docs = [
  ["Investment memo", "Viewed 3 times", "Tracked"],
  ["Fund model summary", "Viewed 1 time", "Tracked"],
  ["Pipeline highlights", "Permission filtered", "Controlled"],
  ["Governance structure", "NDA gated", "Restricted"],
];

export default function InvestorMicrositePage() {
  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band section-dark">
        <div className="section-inner">
          <div className="section-kicker" style={{ color: "var(--copper-bronze)" }}>Investor microsite</div>
          <h1 className="section-title">NDA-Gated Fundraising Conversion Workspace</h1>
          <p className="section-copy">
            Qualified LPs can review investment materials, model summaries, governance, controlled pipeline highlights,
            Q&A, meeting scheduling, and document activity tracking.
          </p>
          <div className="section-actions">
            <Link href="/login" className="btn btn-blue"><LockKeyhole size={16} /> Login required</Link>
            <Link href="/contact" className="btn btn-outline" style={{ color: "white", borderColor: "rgba(255,255,255,0.28)" }}>Request access</Link>
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="section-inner microsite-grid">
          <section className="memo-viewer">
            <div className="badge badge-blue">Document viewer</div>
            <h2>Investment memo preview</h2>
            <p>
              Aurexia combines proprietary deal sourcing, disciplined underwriting, capital structuring, and execution
              infrastructure into one integrated system for African critical mineral investment.
            </p>
            <div className="document-preview">
              <FileText size={42} />
              <span>Preview redacted until NDA completion</span>
            </div>
          </section>
          <aside className="public-form">
            <h2>Fund model summary</h2>
            {["$300M target fund", "18-22% target IRR", "8-12 portfolio assets", "Equity + debt + offtake"].map((item) => (
              <div className="check-row" key={item}><ShieldCheck size={16} /> {item}</div>
            ))}
          </aside>
          <section className="public-form">
            <h2>Tracked materials</h2>
            <table className="table">
              <tbody>
                {docs.map(([name, activity, state]) => (
                  <tr key={name}><td>{name}</td><td>{activity}</td><td><span className="badge badge-gray">{state}</span></td></tr>
                ))}
              </tbody>
            </table>
          </section>
          <section className="public-form">
            <h2>Investor engagement</h2>
            <div className="check-row"><MessageSquare size={16} /> Q&A with Aurexia team</div>
            <div className="check-row"><Calendar size={16} /> Meeting scheduling widget</div>
            <div className="check-row"><Eye size={16} /> Document tracking UI</div>
          </section>
        </div>
      </section>
    </main>
  );
}
