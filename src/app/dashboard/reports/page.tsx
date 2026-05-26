/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bell, X, BarChart3, Download, Clock, CheckCircle2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Report {
  id: string;
  title: string;
  reportType: string;
  status: string;
  storageKey: string | null;
  createdAt: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [form, setForm] = useState({
    title: "",
    reportType: "MONTHLY_SUMMARY",
  });

  const fetchReports = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReports(data.reports || []);
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
    fetchReports(token);
  }, [router, fetchReports]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setReports((prev) => [data.report, ...prev]);
        setShowModal(false);
        setForm({ title: "", reportType: "MONTHLY_SUMMARY" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const filtered = reports.filter((report) => {
    const matchesSearch = report.title?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "ALL" || report.reportType === filterType;
    const matchesStatus = filterStatus === "ALL" || report.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    PENDING: "var(--gray-500)",
    GENERATING: "var(--blue)",
    COMPLETED: "var(--emerald)",
    FAILED: "var(--danger)",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock size={16} />,
    GENERATING: <BarChart3 size={16} />,
    COMPLETED: <CheckCircle2 size={16} />,
    FAILED: <X size={16} />,
  };

  const reportTypes = [
    { value: "MONTHLY_SUMMARY", label: "Monthly Summary" },
    { value: "QUARTERLY_PERFORMANCE", label: "Quarterly Performance" },
    { value: "ANNUAL_REVIEW", label: "Annual Review" },
    { value: "INVESTOR_UPDATE", label: "Investor Update" },
    { value: "DUE_DILIGENCE", label: "Due Diligence" },
    { value: "PORTFOLIO_ANALYSIS", label: "Portfolio Analysis" },
    { value: "RISK_ASSESSMENT", label: "Risk Assessment" },
    { value: "COMPLIANCE_REPORT", label: "Compliance Report" },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const reportStats = {
    total: reports.length,
    completed: reports.filter((r) => r.status === "COMPLETED").length,
    pending: reports.filter((r) => r.status === "PENDING").length,
    generating: reports.filter((r) => r.status === "GENERATING").length,
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
      <Sidebar active="Reports" user={user} />

      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Reports</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Investment performance and platform analytics</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Generate Report
            </button>
          </div>
        </header>

        <main className="main-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Total Reports</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--black)" }}>{reportStats.total}</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Completed</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--emerald)" }}>{reportStats.completed}</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Generating</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--blue)" }}>{reportStats.generating}</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Pending</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--gray-600)" }}>{reportStats.pending}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input className="input" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "40px" }} />
            </div>

            <div>
              <label className="input-label" style={{ marginBottom: "6px" }}>Report Type</label>
              <select
                className="input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="ALL">All Types</option>
                {reportTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label" style={{ marginBottom: "6px" }}>Status</label>
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ cursor: "pointer" }}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="GENERATING">Generating</option>
                <option value="COMPLETED">Completed</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <BarChart3 size={48} style={{ margin: "0 auto 16px", color: "var(--gray-300)" }} />
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--gray-500)", marginBottom: "8px" }}>No reports found</p>
              <p style={{ fontSize: "14px", color: "var(--gray-400)" }}>Generate your first report to get started.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th>Report Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Generated</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((report) => (
                    <tr key={report.id}>
                      <td style={{ textAlign: "center", color: statusColors[report.status] || "var(--gray-500)" }}>
                        {statusIcons[report.status] || <BarChart3 size={16} />}
                      </td>
                      <td style={{ fontWeight: 600 }}>{report.title}</td>
                      <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>
                        {reportTypes.find((t) => t.value === report.reportType)?.label || report.reportType}
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: `${statusColors[report.status] || "var(--gray-500)"}15`,
                            color: statusColors[report.status] || "var(--gray-500)",
                          }}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>{formatDate(report.createdAt)}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          {report.status === "COMPLETED" && report.storageKey && (
                            <button
                              style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "var(--blue)",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                fontSize: "13px",
                              }}
                              onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "var(--blue)15";
                              }}
                              onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.background = "none";
                              }}
                              title="Download Report"
                            >
                              <Download size={14} /> Download
                            </button>
                          )}
                          {report.status === "PENDING" || report.status === "GENERATING" ? (
                            <span style={{ fontSize: "12px", color: "var(--gray-400)", padding: "4px 8px" }}>Processing...</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Generate Report</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Report Title</label>
                <input
                  className="input"
                  type="text"
                  required
                  placeholder="e.g., Q3 2024 Investment Performance"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Report Type</label>
                <select
                  className="input"
                  required
                  value={form.reportType}
                  onChange={(e) => setForm((prev) => ({ ...prev, reportType: e.target.value }))}
                  style={{ cursor: "pointer" }}
                >
                  {reportTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ background: "var(--gray-50)", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "var(--gray-600)", lineHeight: "1.6" }}>
                  <strong>Note:</strong> Report generation may take a few minutes depending on the data volume. You will receive a notification once the report is ready for download.
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-blue" style={{ flex: 1 }}>
                  {saving ? "Generating..." : "Generate Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}