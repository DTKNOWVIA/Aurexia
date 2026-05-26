/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CalendarDays, MapPin, Plus } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

export default function PipelinePage() {
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

  const columns = [
    {
      title: "Origination",
      color: "var(--gray-500)",
      deals: [["Kalahari Nickel", "Botswana", "$22M"], ["Copperbelt Tailings", "Zambia", "$18M"]],
    },
    {
      title: "Screening",
      color: "var(--blue)",
      deals: [["Manica Lithium", "Zimbabwe", "$35M"], ["Namib Rare Earths", "Namibia", "$28M"]],
    },
    {
      title: "Diligence",
      color: "var(--bronze)",
      deals: [["Lufilian Copper", "DRC", "$46M"], ["Great Dyke PGM", "Zimbabwe", "$31M"]],
    },
    {
      title: "IC / Close",
      color: "var(--emerald)",
      deals: [["Northern Cape Manganese", "South Africa", "$40M"], ["Katanga Cobalt", "DRC", "$52M"]],
    },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
      <Sidebar active="Pipeline" user={user} />
      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Deal Pipeline</h2>
            <p style={{ fontSize: 13, color: "var(--gray-400)" }}>Asset stages from origination through IC approval</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button style={{ background: "none", color: "var(--gray-400)", display: "flex" }}><Bell size={20} /></button>
            <button className="btn btn-blue"><Plus size={16} /> New deal</button>
          </div>
        </header>
        <main className="main-content">
          <div className="kanban-board">
            {columns.map((column) => (
              <section className="kanban-column" key={column.title}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <h3 style={{ fontSize: 15 }}>{column.title}</h3>
                  <span className="badge" style={{ background: `${column.color}15`, color: column.color }}>{column.deals.length}</span>
                </div>
                {column.deals.map(([name, region, value]) => (
                  <article className="deal-card" key={name}>
                    <h4 style={{ fontSize: 15, marginBottom: 10 }}>{name}</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--gray-500)", fontSize: 13, marginBottom: 8 }}>
                      <MapPin size={14} /> {region}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--gray-500)", fontSize: 13 }}>
                      <CalendarDays size={14} /> Next review: 7 days
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                      <span className="badge badge-bronze">Critical minerals</span>
                      <strong>{value}</strong>
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
