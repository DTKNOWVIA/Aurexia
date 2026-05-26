/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, DollarSign, Mail, PhoneCall, Users } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function LpCrmPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  const lps = [
    ["Helios Pension Trust", "Qualified", "$25M", "Africa infrastructure", "Maya Chen"],
    ["Northstar Endowment", "Data room", "$15M", "Energy transition", "Daniel Okafor"],
    ["Meridian Family Office", "NDA", "$8M", "Critical minerals", "Leah Smith"],
    ["Caldera Sovereign Fund", "IC review", "$40M", "Direct co-invest", "Ari Botha"],
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
      <Sidebar active="LP CRM" user={user} />
      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>LP CRM</h2>
            <p style={{ fontSize: 13, color: "var(--gray-400)" }}>Investor relationships, mandates, and capital status</p>
          </div>
          <button style={{ background: "none", color: "var(--gray-400)", display: "flex" }}><Bell size={20} /></button>
        </header>
        <main className="main-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 28 }}>
            {[
              [<Users size={20} key="users" />, "Active LPs", "42", "var(--blue)"],
              [<DollarSign size={20} key="dollar" />, "Soft circled", "$118M", "var(--emerald)"],
              [<Mail size={20} key="mail" />, "Open follow-ups", "16", "var(--bronze)"],
              [<PhoneCall size={20} key="phone" />, "Meetings this week", "7", "var(--black)"],
            ].map(([icon, label, value, color]) => (
              <div className="stat-card" key={String(label)}>
                <div style={{ width: 40, height: 40, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${color}15`, color: String(color) }}>{icon}</div>
                <div className="stat-value" style={{ marginTop: 18 }}>{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr><th>Institution</th><th>Status</th><th>Target</th><th>Mandate</th><th>Owner</th></tr>
              </thead>
              <tbody>
                {lps.map(([name, status, target, mandate, owner]) => (
                  <tr key={name}>
                    <td style={{ fontWeight: 700 }}>{name}</td>
                    <td><span className="badge badge-blue">{status}</span></td>
                    <td style={{ fontWeight: 700 }}>{target}</td>
                    <td style={{ color: "var(--gray-500)" }}>{mandate}</td>
                    <td>{owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
