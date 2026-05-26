"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import PublicNav from "@/components/PublicNav";

export default function ContactPage() {
  return (
    <main className="public-shell">
      <PublicNav />
      <section className="section-band">
        <div className="section-inner contact-layout">
          <div>
            <div className="section-kicker">Contact</div>
            <h1 className="section-title">Start an investor, operator, or partner conversation.</h1>
            <p className="section-copy">
              Structured inquiries route into the correct frontend flow: LP access, project submission, partnership,
              or data room access.
            </p>
            <div style={{ display: "grid", gap: 16, marginTop: 32 }}>
              {[
                [<Mail size={18} key="mail" />, "investors@aurexia.capital"],
                [<Phone size={18} key="phone" />, "+27 10 000 0000"],
                [<MapPin size={18} key="pin" />, "Southern Africa focus"],
              ].map(([icon, label]) => (
                <div key={String(label)} style={{ display: "flex", gap: 12, alignItems: "center", fontWeight: 650 }}>
                  <span style={{ color: "var(--blue)" }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <form className="public-form">
            <div className="form-grid">
              <div className="input-group">
                <label className="input-label">Full name</label>
                <input className="input" placeholder="Your name" />
              </div>
              <div className="input-group">
                <label className="input-label">Institution</label>
                <input className="input" placeholder="Company or fund" />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input" type="email" placeholder="you@company.com" />
              </div>
              <div className="input-group">
                <label className="input-label">Inquiry type</label>
                <select className="input" defaultValue="LP inquiry">
                  <option>Request Investor Access</option>
                  <option>Submit a Project</option>
                  <option>Partner with Aurexia</option>
                  <option>Data Room Access</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Ticket size / capital need</label>
                <input className="input" placeholder="$25M" />
              </div>
              <div className="input-group">
                <label className="input-label">Geography / location</label>
                <input className="input" placeholder="Southern Africa" />
              </div>
              <div className="input-group">
                <label className="input-label">Mandate / commodity</label>
                <input className="input" placeholder="Lithium, nickel, manganese" />
              </div>
              <div className="input-group">
                <label className="input-label">Stage</label>
                <select className="input" defaultValue="Lead">
                  <option>Lead</option>
                  <option>NDA</option>
                  <option>Screening</option>
                  <option>Data Room</option>
                </select>
              </div>
              <div className="input-group full-span">
                <label className="input-label">Message</label>
                <textarea className="input" rows={6} placeholder="Tell us what you would like to discuss." />
              </div>
            </div>
            <button type="button" className="btn btn-blue" style={{ width: "100%", marginTop: 8 }}>
              Submit inquiry
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
