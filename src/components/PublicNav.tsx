import Link from "next/link";

export default function PublicNav() {
  return (
    <header className="public-nav">
      <div className="public-nav-inner">
        <Link href="/" className="brand-lockup" aria-label="Aurexia home">
          <span className="brand-mark">A</span>
          <span>AUREXIA</span>
        </Link>
        <nav className="public-links" aria-label="Public navigation">
          <Link href="/strategy">Strategy</Link>
          <Link href="/pipeline">Pipeline</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/esg">ESG</Link>
          <Link href="/insights">Insights</Link>
          <Link href="/team">Team</Link>
          <Link href="/map">Map</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/investor">Investor microsite</Link>
        </nav>
        <Link href="/contact" className="btn btn-blue">
          Request access
        </Link>
      </div>
    </header>
  );
}
