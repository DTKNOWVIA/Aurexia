import PublicNav from "@/components/PublicNav";

const team = [
  ["Managing Partner", "Mining finance, capital structuring, and LP relationships"],
  ["Investment Committee", "IC governance, approvals, conditions, and risk-adjusted return review"],
  ["Operating Partner", "Production, EBITDA improvement, and portfolio KPI accountability"],
  ["ESG & Compliance", "ESG scoring, action plans, audit readiness, and LP reporting"],
];

export default function TeamPage() {
  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band">
        <div className="section-inner">
          <div className="section-kicker">Team</div>
          <h1 className="section-title">Execution-Led Leadership</h1>
          <p className="section-copy">
            Aurexia is led by professionals with deep expertise across mining, finance, investment execution, governance, and ESG.
          </p>
          <div className="feature-grid">
            {team.map(([role, focus]) => (
              <article className="feature-card" key={role}>
                <h3>{role}</h3>
                <p>{focus}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
