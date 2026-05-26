/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bell, X, FileText, Download, Trash2, Upload, File } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Document {
  id: string;
  name: string;
  storageKey: string;
  assetId: string | null;
  investorId: string | null;
  createdAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    assetId: "",
    investorId: "",
  });

  const fetchDocuments = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/documents", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDocuments(data.documents || []);
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
    fetchDocuments(token);
  }, [router, fetchDocuments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) return;

    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (form.assetId) formData.append("assetId", form.assetId);
      if (form.investorId) formData.append("investorId", form.investorId);

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setDocuments((prev) => [data.document, ...prev]);
        setShowModal(false);
        setSelectedFile(null);
        setForm({ assetId: "", investorId: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const filtered = documents.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "xls":
      case "xlsx":
        return "📊";
      case "ppt":
      case "pptx":
        return "📽️";
      case "zip":
      case "rar":
        return "📦";
      default:
        return "📎";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getFileSize = (fileName: string) => {
    // This is a placeholder - in a real app, you'd get the actual file size from the API
    return "2.4 MB";
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
      <Sidebar active="Documents" user={user} />

      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Documents</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Project files, contracts, and supporting documents</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Upload Document
            </button>
          </div>
        </header>

        <main className="main-content">
          <div style={{ position: "relative", marginBottom: "24px", maxWidth: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
            <input className="input" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "40px" }} />
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <FileText size={48} style={{ margin: "0 auto 16px", color: "var(--gray-300)" }} />
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--gray-500)", marginBottom: "8px" }}>No documents found</p>
              <p style={{ fontSize: "14px", color: "var(--gray-400)" }}>Upload your first document to get started.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Uploaded</th>
                    <th>Related To</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((doc) => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px" }}>{getFileIcon(doc.name)}</span>
                        {doc.name}
                      </td>
                      <td style={{ color: "var(--gray-500)" }}>
                        {doc.name.split(".").pop()?.toUpperCase() || "FILE"}
                      </td>
                      <td style={{ color: "var(--gray-500)" }}>{getFileSize(doc.name)}</td>
                      <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>{formatDate(doc.createdAt)}</td>
                      <td>
                        {doc.assetId ? (
                          <span className="badge badge-bronze" style={{ fontSize: "11px" }}>Asset</span>
                        ) : doc.investorId ? (
                          <span className="badge badge-blue" style={{ fontSize: "11px" }}>Investor</span>
                        ) : (
                          <span className="badge badge-gray" style={{ fontSize: "11px" }}>General</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--blue)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "var(--blue)15";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "none";
                            }}
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--danger)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "var(--danger)15";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "none";
                            }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
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
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Upload Document</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  border: `2px dashed ${dragActive ? "var(--blue)" : "var(--gray-200)"}`,
                  borderRadius: "12px",
                  padding: "32px 24px",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  background: dragActive ? "var(--blue)08" : "transparent",
                  marginBottom: "24px",
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload size={32} style={{ margin: "0 auto 12px", color: dragActive ? "var(--blue)" : "var(--gray-400)" }} />
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--black)", marginBottom: "4px" }}>
                  {selectedFile ? selectedFile.name : "Drag and drop your file here"}
                </p>
                <p style={{ fontSize: "12px", color: "var(--gray-400)" }}>
                  or click to browse
                </p>
              </div>

              <input
                id="file-input"
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
              />

              <div className="input-group">
                <label className="input-label">Related Asset (Optional)</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Asset ID or name"
                  value={form.assetId}
                  onChange={(e) => setForm((prev) => ({ ...prev, assetId: e.target.value }))}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Related Investor (Optional)</label>
                <input
                  className="input"
                  type="text"
                  placeholder="Investor ID or name"
                  value={form.investorId}
                  onChange={(e) => setForm((prev) => ({ ...prev, investorId: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving || !selectedFile} className="btn btn-blue" style={{ flex: 1 }}>
                  {saving ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}