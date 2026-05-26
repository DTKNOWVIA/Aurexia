/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Bell, X, Trash2, Edit2, Copy, Check } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface CurrentUser {
  id: string;
  email: string;
  role: string;
}

interface InviteResponse {
  message: string;
  user: User;
  temporaryPassword: string;
}

const ROLES = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "GP_PARTNER", label: "GP Partner" },
  { value: "CIO", label: "CIO" },
  { value: "INVESTMENT_MANAGER", label: "Investment Manager" },
  { value: "ANALYST", label: "Analyst" },
  { value: "OPERATING_PARTNER", label: "Operating Partner" },
  { value: "ESG_COMPLIANCE", label: "ESG Compliance" },
  { value: "LEGAL", label: "Legal" },
  { value: "LP", label: "LP" },
  { value: "OPERATOR", label: "Operator" },
  { value: "ADVISOR", label: "Advisor" },
];

export default function UsersPage() {
  const router = useRouter();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteError, setInviteError] = useState("");
  const [editError, setEditError] = useState("");
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "ANALYST",
    temporaryPassword: "",
  });
  const [editForm, setEditForm] = useState({
    role: "",
  });
  const [inviteResponse, setInviteResponse] = useState<InviteResponse | null>(null);

  const fetchUsers = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
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
    const currentUser = JSON.parse(stored);
    setUser(currentUser);
    if (currentUser.role !== "SUPER_ADMIN") {
      router.push("/dashboard");
      return;
    }
    fetchUsers(token);
  }, [router, fetchUsers]);

  async function handleInviteUser(e: React.FormEvent) {
    e.preventDefault();
    setInviteError("");
    setSaving(true);
    const token = localStorage.getItem("token");

    if (!inviteForm.email || !inviteForm.role || !inviteForm.temporaryPassword) {
      setInviteError("All fields are required");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inviteForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setInviteError(errorData.error || "Failed to invite user");
        setSaving(false);
        return;
      }

      const data = await res.json();
      setInviteResponse(data);
      setUsers((prev) => [data.user, ...prev]);
      setShowInviteModal(false);
      setShowPasswordModal(true);
      setInviteForm({ email: "", role: "ANALYST", temporaryPassword: "" });
    } catch (err) {
      console.error("Error inviting user:", err);
      setInviteError("An error occurred while inviting the user");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateRole(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedUser) return;

    setEditError("");
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/users?id=${selectedUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: editForm.role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setEditError(errorData.error || "Failed to update role");
        setSaving(false);
        return;
      }

      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? data.user : u)));
      setShowEditModal(false);
      setSelectedUser(null);
      setEditForm({ role: "" });
    } catch (err) {
      console.error("Error updating role:", err);
      setEditError("An error occurred while updating the role");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteUser(userId: string, userEmail: string) {
    if (!window.confirm(`Are you sure you want to delete ${userEmail}? This action cannot be undone.`)) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting user:", errorData.error);
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  }

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      SUPER_ADMIN: "var(--danger)",
      GP_PARTNER: "var(--blue)",
      CIO: "var(--emerald)",
      INVESTMENT_MANAGER: "var(--bronze)",
      ANALYST: "var(--gray-500)",
      OPERATING_PARTNER: "var(--blue)",
      ESG_COMPLIANCE: "var(--emerald)",
      LEGAL: "var(--gray-600)",
      LP: "var(--bronze)",
      OPERATOR: "var(--gray-500)",
      ADVISOR: "var(--gray-500)",
    };
    return roleColors[role] || "var(--gray-500)";
  };

  const generatePassword = () => {
    const length = 12;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setInviteForm((prev) => ({ ...prev, temporaryPassword: password }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  let filtered = users.filter((u) =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  if (activeTab !== "all") {
    filtered = filtered.filter((u) => u.role === activeTab);
  }

  const tabs = [
    { id: "all", label: "All Users", count: users.length },
    { id: "SUPER_ADMIN", label: "Super Admins", count: users.filter((u) => u.role === "SUPER_ADMIN").length },
    { id: "ANALYST", label: "Analysts", count: users.filter((u) => u.role === "ANALYST").length },
    { id: "INVESTMENT_MANAGER", label: "Managers", count: users.filter((u) => u.role === "INVESTMENT_MANAGER").length },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--off-white)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--gray-400)" }}>Loading...</div>
      </div>
    );
  }

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
        <Sidebar active="Users" user={user} />
        <div className="main-layout">
          <main className="main-content">
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--gray-500)", marginBottom: "8px" }}>Access Denied</p>
              <p style={{ fontSize: "14px", color: "var(--gray-400)" }}>Only Super Admins can manage users.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
      <Sidebar active="Users" user={user} />
      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Users</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Team member management and access control</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <button onClick={() => setShowInviteModal(true)} className="btn btn-blue" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={16} /> Invite User
            </button>
          </div>
        </header>
        <main className="main-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: activeTab === tab.id ? "2px solid var(--blue)" : "1px solid var(--gray-200)",
                  background: activeTab === tab.id ? "var(--blue)08" : "white",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: activeTab === tab.id ? "var(--blue)" : "var(--gray-600)",
                }}
              >
                {tab.label} <span style={{ color: "var(--gray-400)", marginLeft: "6px" }}>({tab.count})</span>
              </button>
            ))}
          </div>
          <div style={{ position: "relative", marginBottom: "24px", maxWidth: "400px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
            <input className="input" placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: "40px" }} />
          </div>
          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--gray-500)", marginBottom: "8px" }}>No users found</p>
              <p style={{ fontSize: "14px", color: "var(--gray-400)" }}>Try adjusting your filters or invite a new team member.</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th style={{ textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.email}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: `${getRoleColor(u.role)}15`,
                            color: getRoleColor(u.role),
                          }}
                        >
                          {u.role?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>{formatDate(u.createdAt)}</td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setEditForm({ role: u.role });
                              setEditError("");
                              setShowEditModal(true);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--blue)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              transition: "all 0.2s ease",
                            }}
                            title="Edit role"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "var(--danger)",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              transition: "all 0.2s ease",
                            }}
                            title="Delete user"
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
      {showInviteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Invite User</h3>
              <button onClick={() => { setShowInviteModal(false); setInviteError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            {inviteError && (
              <div style={{ background: "var(--danger)15", border: "1px solid var(--danger)30", color: "var(--danger)", padding: "12px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
                {inviteError}
              </div>
            )}
            <form onSubmit={handleInviteUser}>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  className="input"
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Role</label>
                <select
                  className="input"
                  required
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm((prev) => ({ ...prev, role: e.target.value }))}
                  style={{ cursor: "pointer" }}
                >
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Temporary Password</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    className="input"
                    type="text"
                    required
                    placeholder="Generate a secure temporary password"
                    value={inviteForm.temporaryPassword}
                    onChange={(e) => setInviteForm((prev) => ({ ...prev, temporaryPassword: e.target.value }))}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="btn btn-outline"
                    style={{ flexShrink: 0 }}
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div style={{ background: "var(--gray-50)", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
                <p style={{ fontSize: "13px", color: "var(--gray-600)", lineHeight: "1.6" }}>
                  <strong>Note:</strong> The user will receive an invitation with their temporary password. They should change it upon first login.
                </p>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => { setShowInviteModal(false); setInviteError(""); }} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-blue" style={{ flex: 1 }}>
                  {saving ? "Inviting..." : "Send Invite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && selectedUser && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>Update User Role</h3>
              <button onClick={() => { setShowEditModal(false); setEditError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            {editError && (
              <div style={{ background: "var(--danger)15", border: "1px solid var(--danger)30", color: "var(--danger)", padding: "12px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px" }}>
                {editError}
              </div>
            )}
            <form onSubmit={handleUpdateRole}>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input className="input" type="email" disabled value={selectedUser.email} />
              </div>
              <div className="input-group">
                <label className="input-label">Current Role</label>
                <input className="input" type="text" disabled value={selectedUser.role?.replace(/_/g, " ")} />
              </div>
              <div className="input-group">
                <label className="input-label">New Role</label>
                <select
                  className="input"
                  required
                  value={editForm.role}
                  onChange={(e) => setEditForm({ role: e.target.value })}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select a role</option>
                  {ROLES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => { setShowEditModal(false); setEditError(""); }} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-blue" style={{ flex: 1 }}>
                  {saving ? "Updating..." : "Update Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPasswordModal && inviteResponse && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: "24px" }}>
          <div className="card" style={{ width: "100%", maxWidth: "520px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800 }}>User Invited Successfully</h3>
              <button onClick={() => setShowPasswordModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "14px", color: "var(--gray-600)", marginBottom: "16px" }}>
                Share the temporary password below with <strong>{inviteResponse.user.email}</strong>:
              </p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div
                  style={{
                    flex: 1,
                    padding: "12px 14px",
                    background: "var(--gray-50)",
                    border: "1px solid var(--gray-200)",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--black)",
                    wordBreak: "break-all",
                  }}
                >
                  {inviteResponse.temporaryPassword}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteResponse.temporaryPassword);
                    setCopiedPassword(true);
                    setTimeout(() => setCopiedPassword(false), 2000);
                  }}
                  style={{
                    background: "var(--blue)",
                    color: "white",
                    border: "none",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                  }}
                >
                  {copiedPassword ? <Check size={14} /> : <Copy size={14} />}
                  {copiedPassword ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <div style={{ background: "var(--emerald)15", padding: "16px", borderRadius: "8px", marginBottom: "24px", borderLeft: "4px solid var(--emerald)" }}>
              <p style={{ fontSize: "13px", color: "var(--emerald)", lineHeight: "1.6" }}>
                <strong>✓ User created successfully</strong>  

                They can now log in with their email and the temporary password. They should change their password upon first login.
              </p>
            </div>
            <button onClick={() => setShowPasswordModal(false)} className="btn btn-blue" style={{ width: "100%" }}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
