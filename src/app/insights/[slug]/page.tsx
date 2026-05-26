import Link from "next/link";
import PublicNav from "@/components/PublicNav";

const titles: Record<string, string> = {
  "battery-metals-demand": "Global Battery Metals Demand",
  "africa-supply-chains": "Africa Supply Chains",
  "institutional-mining": "Institutionalising Fragmented Assets",
};

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = titles[slug] ?? "Aurexia Insight";

  return (
    <main className="public-shell">
      <PublicNav />
      <article className="section-band">
        <div className="section-inner readable">
          <Link href="/insights" className="badge badge-gray">Back to insights</Link>
          <h1 className="section-title">{title}</h1>
          <p className="section-copy">
            Aurexia&apos;s investment lens connects geological potential with structured capital, governance, ESG controls,
            offtake readiness, and exit pathways. This article template is ready for market commentary and editorial
            publishing as the insights program expands.
          </p>
          <div className="public-form">
            <h2>Key themes</h2>
            <p>Energy transition demand, Southern Africa supply chains, institutional diligence, and value creation through execution.</p>
          </div>
        </div>
      </article>
    </main>
  );
}
