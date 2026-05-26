/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bell, X, CheckCircle2, Circle, AlertCircle, Calendar } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Asset {
  id: string;
  name: string;
}

interface Assignee {
  id: string;
  email: string;
  role: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
  assetId: string | null;
  assigneeId: string | null;
  createdAt: string;
  asset: Asset | null;
  assignee: Assignee | null;
}

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [form, setForm] = useState({
    title: "",
    assetId: "",
    assigneeId: "",
    dueDate: "",
  });

  const fetchTasks = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
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
    fetchTasks(token);
  }, [router, fetchTasks]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          assetId: form.assetId || null,
          assigneeId: form.assigneeId || null,
          dueDate: form.dueDate || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setTasks((prev) => [data.task, ...prev]);
        setShowModal(false);
        setForm({ title: "", assetId: "", assigneeId: "", dueDate: "" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const filtered = tasks.filter((task) => {
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    PENDING: "var(--gray-500)",
    IN_PROGRESS: "var(--blue)",
    COMPLETED: "var(--emerald)",
    BLOCKED: "var(--danger)",
    ON_HOLD: "var(--warning)",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Circle size={16} />,
    IN_PROGRESS: <AlertCircle size={16} />,
    COMPLETED: <CheckCircle2 size={16} />,
    BLOCKED: <AlertCircle size={16} />,
    ON_HOLD: <Circle size={16} />,
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
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
      <Sidebar active="Tasks" user={user} />

      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Tasks</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Team workload and project task management</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <button onClick={() => setShowModal(true)} className="btn btn-blue" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Create Task
            </button>
          </div>
        </header>

        <main className="main-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Total Tasks</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--black)" }}>{taskStats.total}</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>In Progress</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--blue)" }}>{taskStats.inProgress}</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Pending</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--gray-600)" }}>{taskStats.pending}</div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Completed</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--emerald)" }}>{taskStats.completed}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "flex-end" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input className="input" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "40px" }} />
            </div>

            <div>
              <label className="input-label" style={{ marginBottom: "6px" }}>Filter by Status</label>
              <select
                className="input"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ cursor: "pointer", minWidth: "180px" }}
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="BLOCKED">Blocked</option>
                <option value="ON_HOLD">On Hold</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <CheckCircle2 size={48} style={{ margin: "0 auto 16px", color: "var(--gray-300)" }} />
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--gray-500)", marginBottom: "8px" }}>No tasks found</p>
              <p style={{ fontSize: "14px", color: "var(--gray-400)" }}>Create your first task to get started.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: "40px" }}></th>
                    <th>Task Title</th>
                    <th>Status</th>
                    <th>Asset</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((task) => (
                    <tr key={task.id}>
                      <td style={{ textAlign: "center", color: statusColors[task.status] || "var(--gray-500)" }}>
                        {statusIcons[task.status] || <Circle size={16} />}
                      </td>
                      <td style={{ fontWeight: 600 }}>{task.title}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: `${statusColors[task.status] || "var(--gray-500)"}15`,
                            color: statusColors[task.status] || "var(--gray-500)",
                          }}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td style={{ color: "var(--gray-500)" }}>{task.asset?.name || "—"}</td>
                      <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>
                        {task.assignee?.email?.split("@")[0] || "—"}
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: isOverdue(task.dueDate) && task.status !== "COMPLETED" ? "var(--danger)" : "var(--gray-500)",
                            fontSize: "13px",
                          }}
                        >
                          {isOverdue(task.dueDate) && task.status !== "COMPLETED" && (
                            <AlertCircle size={14} />
                          )}
                          {formatDate(task.dueDate)}
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
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Create Task</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="input-label">Task Title</label>
                <input
                  className="input"
                  type="text"
                  required
                  placeholder="e.g., Complete due diligence on Gold Mine XYZ"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>

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
                <label className="input-label">Assign To (Optional)</label>
                <input
                  className="input"
                  type="text"
                  placeholder="User email or ID"
                  value={form.assigneeId}
                  onChange={(e) => setForm((prev) => ({ ...prev, assigneeId: e.target.value }))}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Due Date (Optional)</label>
                <input
                  className="input"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-blue" style={{ flex: 1 }}>
                  {saving ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}