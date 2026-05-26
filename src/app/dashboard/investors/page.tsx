/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bell, X } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Investor {
  id: string;
  name: string;
  institution: string;
  email: string;
  ticketSize: number;
  geography: string;
  mandate: string;
  status: string;
  createdAt: string;
}

export default function InvestorsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    institution: "",
    email: "",
    ticketSize: "",
    geography: "",
    mandate: "",
  });

  const fetchInvestors = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/investors", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setInvestors(data.investors || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchInvestors(token);
  }, [router, fetchInvestors]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/investors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          ticketSize: form.ticketSize ? parseFloat(form.ticketSize) : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInvestors((prev) => [data.investor, ...prev]);
        setShowModal(false);
        setForm({ name: "", institution: "", email: "", ticketSize: "", geography: "", mandate: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const filtered = investors.filter(
    (inv) =>
      inv.name?.toLowerCase().includes(search.toLowerCase()) ||
      inv.institution?.toLowerCase().includes(search.toLowerCase()) ||
      inv.email?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    LEAD: "var(--gray-500)",
    QUALIFIED: "var(--blue)",
    NDA: "var(--bronze)",
    DATA_ROOM: "var(--emerald)",
    DD: "var(--bronze)",
    SUBSCRIPTION: "var(--emerald)",
    ACTIVE_LP: "var(--emerald)",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--off-white)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--gray-400)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
      <Sidebar active="Investors" user={user} />

      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Investors</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>LP pipeline and investor management</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Add Investor
            </button>
          </div>
        </header>

        <main className="main-content">
          <div style={{ position: "relative", marginBottom: "24px", maxWidth: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
            <input className="input" placeholder="Search investors..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "40px" }} />
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Institution</th>
                  <th>Email</th>
                  <th>Ticket Size</th>
                  <th>Geography</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--gray-400)", padding: "48px" }}>
                      No investors found. Add your first investor.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.name}</td>
                      <td style={{ color: "var(--gray-500)" }}>{inv.institution || "—"}</td>
                      <td style={{ color: "var(--gray-500)" }}>{inv.email}</td>
                      <td style={{ fontWeight: 600 }}>{inv.ticketSize ? `$${(inv.ticketSize / 1000000).toFixed(1)}M` : "—"}</td>
                      <td style={{ color: "var(--gray-500)" }}>{inv.geography || "—"}</td>
                      <td>
                        <span className="badge" style={{ background: `${statusColors[inv.status] || "var(--gray-500)"}15`, color: statusColors[inv.status] || "var(--gray-500)" }}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Add Investor</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Full Name", key: "name", type: "text", required: true, placeholder: "John Smith" },
                { label: "Institution", key: "institution", type: "text", required: false, placeholder: "ABC Capital" },
                { label: "Email", key: "email", type: "email", required: true, placeholder: "john@abccapital.com" },
                { label: "Ticket Size (USD)", key: "ticketSize", type: "number", required: false, placeholder: "5000000" },
                { label: "Geography", key: "geography", type: "text", required: false, placeholder: "South Africa" },
                { label: "Mandate", key: "mandate", type: "text", required: false, placeholder: "Critical minerals" },
              ].map((field) => (
                <div key={field.key} className="input-group">
                  <label className="input-label">{field.label}</label>
                  <input
                    className="input"
                    type={field.type}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  />
                </div>
              ))}
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-blue" style={{ flex: 1 }}>{saving ? "Saving..." : "Add Investor"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}