import PublicNav from "@/components/PublicNav";

const rows = [
  ["Governance", "Founder-led and informal", "Board, reporting cadence, controls"],
  ["EBITDA", "Low or inconsistent", "Optimised margin and cash yield"],
  ["Market Access", "Limited buyer relationships", "Secured offtake and exit path"],
  ["Data Quality", "Fragmented records", "Institutional diligence pack"],
];

export default function PortfolioPage() {
  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band section-dark">
        <div className="section-inner">
          <div className="section-kicker" style={{ color: "var(--copper-bronze)" }}>Portfolio</div>
          <h1 className="section-title">From Fragmented Assets to Institutional Platforms</h1>
          <p className="section-copy">
            Aurexia&apos;s public portfolio view focuses on transformation cases rather than sensitive holdings, showing
            how operational discipline converts geological assets into bankable investments.
          </p>
        </div>
      </section>
      <section className="section-band">
        <div className="section-inner">
          <table className="comparison-table">
            <thead>
              <tr><th>Metric</th><th>Before</th><th>After Aurexia</th></tr>
            </thead>
            <tbody>
              {rows.map(([metric, before, after]) => (
                <tr key={metric}><td>{metric}</td><td>{before}</td><td>{after}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="feature-grid">
            {["Production recovery", "ESG action plan", "Diligence data room"].map((title) => (
              <article className="feature-card" key={title}>
                <h3>{title}</h3>
                <p>Portfolio tracking covers KPIs, action owners, document readiness, and exit-relevant value creation.</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
