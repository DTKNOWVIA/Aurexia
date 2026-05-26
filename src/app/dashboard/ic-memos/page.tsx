/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bell, X, FileText, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Comment {
  id: string;
  body: string;
  userId: string;
  createdAt: string;
}

interface ICMemo {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  comments: Comment[];
}

export default function ICMemosPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [memos, setMemos] = useState<ICMemo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<ICMemo | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const fetchMemos = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/ic-memos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMemos(data.memos || []);
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
    fetchMemos(token);
  }, [router, fetchMemos]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/ic-memos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setMemos((prev) => [data.memo, ...prev]);
        setShowModal(false);
        setForm({ title: "", content: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const filtered = memos.filter(
    (memo) =>
      memo.title?.toLowerCase().includes(search.toLowerCase()) ||
      memo.content?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    DRAFT: "var(--gray-500)",
    IN_REVIEW: "var(--blue)",
    APPROVED: "var(--emerald)",
    REJECTED: "var(--danger)",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
      <Sidebar active="IC Memos" user={user} />

      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>IC Memos</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Investment Committee memorandums and decision documents</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Create Memo
            </button>
          </div>
        </header>

        <main className="main-content">
          <div style={{ position: "relative", marginBottom: "24px", maxWidth: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
            <input className="input" placeholder="Search memos..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "40px" }} />
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <FileText size={48} style={{ margin: "0 auto 16px", color: "var(--gray-300)" }} />
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--gray-500)", marginBottom: "8px" }}>No memos found</p>
              <p style={{ fontSize: "14px", color: "var(--gray-400)" }}>Create your first IC memo to get started.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
              {filtered.map((memo) => (
                <div
                  key={memo.id}
                  className="card"
                  style={{ cursor: "pointer", transition: "all 0.2s ease", border: "1px solid var(--gray-200)" }}
                  onClick={() => {
                    setSelectedMemo(memo);
                    setShowDetails(true);
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, color: "var(--black)", marginBottom: "4px", lineHeight: "1.3" }}>
                        {memo.title}
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "var(--gray-400)" }}>
                        <Clock size={12} />
                        {formatDate(memo.createdAt)}
                      </div>
                    </div>
                    <span
                      className="badge"
                      style={{
                        background: `${statusColors[memo.status] || "var(--gray-500)"}15`,
                        color: statusColors[memo.status] || "var(--gray-500)",
                        flexShrink: 0,
                        marginLeft: "8px",
                      }}
                    >
                      {memo.status}
                    </span>
                  </div>

                  <p style={{ fontSize: "13px", color: "var(--gray-500)", lineHeight: "1.5", marginBottom: "12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {memo.content}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--gray-400)" }}>
                    <span>💬 {memo.comments?.length || 0} comments</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Create IC Memo</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Memo Title</label>
                <input
                  className="input"
                  type="text"
                  required
                  placeholder="e.g., Investment Opportunity - Gold Mine XYZ"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Memo Content</label>
                <textarea
                  className="input"
                  required
                  placeholder="Enter the full memo content here. Include investment thesis, key metrics, risks, and recommendations..."
                  value={form.content}
                  onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                  style={{ minHeight: "200px", fontFamily: "Inter, sans-serif", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-blue" style={{ flex: 1 }}>
                  {saving ? "Creating..." : "Create Memo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetails && selectedMemo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "700px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "24px", fontWeight: 800, color: "var(--black)", marginBottom: "8px" }}>
                  {selectedMemo.title}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "var(--gray-500)" }}>
                  <span>Created {formatDate(selectedMemo.createdAt)}</span>
                  <span
                    className="badge"
                    style={{
                      background: `${statusColors[selectedMemo.status] || "var(--gray-500)"}15`,
                      color: statusColors[selectedMemo.status] || "var(--gray-500)",
                    }}
                  >
                    {selectedMemo.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setShowDetails(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ borderTop: "1px solid var(--gray-200)", paddingTop: "24px", marginBottom: "24px" }}>
              <p style={{ fontSize: "14px", lineHeight: "1.8", color: "var(--gray-600)", whiteSpace: "pre-wrap" }}>
                {selectedMemo.content}
              </p>
            </div>

            <div style={{ borderTop: "1px solid var(--gray-200)", paddingTop: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, marginBottom: "16px" }}>
                Comments ({selectedMemo.comments?.length || 0})
              </h3>
              {selectedMemo.comments && selectedMemo.comments.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedMemo.comments.map((comment) => (
                    <div key={comment.id} style={{ padding: "12px", background: "var(--gray-50)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "13px", color: "var(--gray-600)", marginBottom: "4px" }}>
                        {comment.body}
                      </p>
                      <p style={{ fontSize: "11px", color: "var(--gray-400)" }}>
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "13px", color: "var(--gray-400)", textAlign: "center", padding: "24px" }}>
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}