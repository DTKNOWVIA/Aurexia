import Link from "next/link";
import PublicNav from "@/components/PublicNav";

const insights = [
  ["battery-metals-demand", "Global Battery Metals Demand", "How energy transition demand reshapes African critical mineral strategy."],
  ["africa-supply-chains", "Africa Supply Chains", "Why logistics, governance, and offtake matter as much as geology."],
  ["institutional-mining", "Institutionalising Fragmented Assets", "The operating model behind transforming local mines into investable platforms."],
];

export default function InsightsPage() {
  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band">
        <div className="section-inner">
          <div className="section-kicker">Insights</div>
          <h1 className="section-title">Aurexia Insights</h1>
          <p className="section-copy">Thought leadership on battery metals demand, African supply chains, and energy transition investment.</p>
          <div className="feature-grid">
            {insights.map(([slug, title, copy]) => (
              <Link className="feature-card" key={slug} href={`/insights/${slug}`}>
                <div className="badge badge-bronze">Research note</div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
