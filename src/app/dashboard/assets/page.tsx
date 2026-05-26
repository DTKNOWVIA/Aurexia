/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bell, X, Filter } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Asset {
  id: string;
  name: string;
  commodity: string;
  country: string;
  stage: string;
  capitalNeed: number;
  readinessScore: number;
  createdAt: string;
}

export default function AssetsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({
    commodity: "",
    country: "",
    stage: "",
  });
  const [form, setForm] = useState({
    name: "",
    commodity: "",
    country: "",
    stage: "SOURCED",
    capitalNeed: "",
    readinessScore: "",
  });

  const fetchAssets = useCallback(async (token: string) => {
    try {
      const params = new URLSearchParams();
      if (filters.commodity) params.append("commodity", filters.commodity);
      if (filters.country) params.append("country", filters.country);
      if (filters.stage) params.append("stage", filters.stage);

      const res = await fetch(`/api/assets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(stored));
    fetchAssets(token);
  }, [router, fetchAssets]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          capitalNeed: form.capitalNeed ? parseFloat(form.capitalNeed) : null,
          readinessScore: form.readinessScore ? parseInt(form.readinessScore) : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAssets((prev) => [data.asset, ...prev]);
        setShowModal(false);
        setForm({ name: "", commodity: "", country: "", stage: "SOURCED", capitalNeed: "", readinessScore: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const filtered = assets.filter(
    (asset) =>
      asset.name?.toLowerCase().includes(search.toLowerCase()) ||
      asset.commodity?.toLowerCase().includes(search.toLowerCase()) ||
      asset.country?.toLowerCase().includes(search.toLowerCase())
  );

  const stageColors: Record<string, string> = {
    SOURCED: "var(--gray-500)",
    IDENTIFIED: "var(--blue)",
    DUE_DILIGENCE: "var(--bronze)",
    NEGOTIATION: "var(--bronze)",
    ACQUISITION: "var(--emerald)",
    PRODUCTION: "var(--emerald)",
    EXIT: "var(--gray-600)",
  };

  const commodities = ["Gold", "Copper", "Lithium", "Cobalt", "Iron Ore", "Nickel", "Zinc", "Silver"];
  const countries = ["South Africa", "Zimbabwe", "Zambia", "Democratic Republic of Congo", "Botswana", "Namibia", "Tanzania"];
  const stages = ["SOURCED", "IDENTIFIED", "DUE_DILIGENCE", "NEGOTIATION", "ACQUISITION", "PRODUCTION", "EXIT"];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--off-white)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--gray-400)" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
      <Sidebar active="Assets" user={user} />

      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Assets</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Mine asset pipeline and management</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Add Asset
            </button>
          </div>
        </header>

        <main className="main-content">
          <div style={{ marginBottom: "24px" }}>
            <div style={{ position: "relative", marginBottom: "16px", maxWidth: "400px" }}>
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input className="input" placeholder="Search assets..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "40px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <div>
                <label className="input-label">Commodity</label>
                <select
                  className="input"
                  value={filters.commodity}
                  onChange={(e) => setFilters((prev) => ({ ...prev, commodity: e.target.value }))}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">All Commodities</option>
                  {commodities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Country</label>
                <select
                  className="input"
                  value={filters.country}
                  onChange={(e) => setFilters((prev) => ({ ...prev, country: e.target.value }))}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">All Countries</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="input-label">Stage</label>
                <select
                  className="input"
                  value={filters.stage}
                  onChange={(e) => setFilters((prev) => ({ ...prev, stage: e.target.value }))}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">All Stages</option>
                  {stages.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Commodity</th>
                  <th>Country</th>
                  <th>Stage</th>
                  <th>Capital Need</th>
                  <th>Readiness Score</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", color: "var(--gray-400)", padding: "48px" }}>
                      No assets found. Add your first asset.
                    </td>
                  </tr>
                ) : (
                  filtered.map((asset) => (
                    <tr key={asset.id}>
                      <td style={{ fontWeight: 600 }}>{asset.name}</td>
                      <td style={{ color: "var(--gray-500)" }}>{asset.commodity}</td>
                      <td style={{ color: "var(--gray-500)" }}>{asset.country}</td>
                      <td>
                        <span className="badge" style={{ background: `${stageColors[asset.stage] || "var(--gray-500)"}15`, color: stageColors[asset.stage] || "var(--gray-500)" }}>
                          {asset.stage}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{asset.capitalNeed ? `$${(asset.capitalNeed / 1000000).toFixed(1)}M` : "—"}</td>
                      <td style={{ fontWeight: 600, color: asset.readinessScore ? "var(--emerald)" : "var(--gray-400)" }}>
                        {asset.readinessScore ? `${asset.readinessScore}%` : "—"}
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
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Add Asset</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              {[
                { label: "Asset Name", key: "name", type: "text", required: true, placeholder: "Gold Mine XYZ" },
                { label: "Commodity", key: "commodity", type: "text", required: true, placeholder: "Gold" },
                { label: "Country", key: "country", type: "text", required: true, placeholder: "South Africa" },
                { label: "Stage", key: "stage", type: "select", required: true, options: stages },
                { label: "Capital Need (USD)", key: "capitalNeed", type: "number", required: false, placeholder: "50000000" },
                { label: "Readiness Score (%)", key: "readinessScore", type: "number", required: false, placeholder: "75", min: 0, max: 100 },
              ].map((field) => (
                <div key={field.key} className="input-group">
                  <label className="input-label">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      className="input"
                      required={field.required}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      style={{ cursor: "pointer" }}
                    >
                      <option value="">Select {field.label}</option>
                      {(field.options || []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="input"
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                      min={field.min}
                      max={field.max}
                    />
                  )}
                </div>
              ))}
              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-blue" style={{ flex: 1 }}>{saving ? "Saving..." : "Add Asset"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}