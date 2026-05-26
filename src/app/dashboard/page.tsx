/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, Pickaxe, FileText, CheckSquare, TrendingUp, Plus, Bell } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Stats {
  investors: number;
  assets: number;
  memos: number;
  tasks: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats>({ investors: 0, assets: 0, memos: 0, tasks: 0 });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async (token: string) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [investorsRes, assetsRes, memosRes, tasksRes] = await Promise.all([
        fetch("/api/investors", { headers }),
        fetch("/api/assets", { headers }),
        fetch("/api/ic-memos", { headers }),
        fetch("/api/tasks", { headers }),
      ]);
      const [investors, assets, memos, tasks] = await Promise.all([
        investorsRes.json(),
        assetsRes.json(),
        memosRes.json(),
        tasksRes.json(),
      ]);
      setStats({
        investors: investors.investors?.length || 0,
        assets: assets.assets?.length || 0,
        memos: memos.memos?.length || 0,
        tasks: tasks.tasks?.length || 0,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
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
    fetchStats(token);
  }, [router, fetchStats]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--off-white)" }}>
        <div style={{ fontFamily: "Syne, sans-serif", fontSize: "18px", fontWeight: 700, color: "var(--gray-400)" }}>Loading...</div>
      </div>
    );
  }

  const statCards = [
    { label: "Total Investors", value: stats.investors, change: "LP Pipeline", color: "var(--blue)", icon: <Users size={20} /> },
    { label: "Assets in Pipeline", value: stats.assets, change: "Deal Origination", color: "var(--bronze)", icon: <Pickaxe size={20} /> },
    { label: "IC Memos", value: stats.memos, change: "Investment Committee", color: "var(--emerald)", icon: <FileText size={20} /> },
    { label: "Active Tasks", value: stats.tasks, change: "Team Workload", color: "var(--black)", icon: <CheckSquare size={20} /> },
  ];

  const quickActions = [
    { label: "Add new investor", href: "/dashboard/investors", color: "var(--blue)", icon: <Plus size={14} /> },
    { label: "Add mine asset", href: "/dashboard/assets", color: "var(--bronze)", icon: <Plus size={14} /> },
    { label: "Create IC memo", href: "/dashboard/ic-memos", color: "var(--emerald)", icon: <Plus size={14} /> },
    { label: "Upload document", href: "/dashboard/documents", color: "var(--gray-600)", icon: <Plus size={14} /> },
    { label: "Create task", href: "/dashboard/tasks", color: "var(--black)", icon: <Plus size={14} /> },
  ];

  const overviewItems = [
    { label: "Fund Target", value: "$300M", color: "var(--blue)" },
    { label: "Target IRR", value: "18–22%", color: "var(--emerald)" },
    { label: "Focus Region", value: "Southern Africa", color: "var(--bronze)" },
    { label: "Asset Stage", value: "Pre-production", color: "var(--gray-600)" },
    { label: "Platform Status", value: "Live", color: "var(--emerald)" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--off-white)" }}>
      <Sidebar active="Dashboard" user={user} />
      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Dashboard</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Welcome back, {user?.email?.split("@")[0]}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gray-400)", display: "flex" }}>
              <Bell size={20} />
            </button>
            <div style={{ padding: "6px 14px", background: "var(--gray-100)", borderRadius: "100px", fontSize: "12px", fontWeight: 600, color: "var(--gray-600)" }}>
              {user?.role?.replace(/_/g, " ")}
            </div>
          </div>
        </header>

        <main className="main-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            {statCards.map((stat, i) => (
              <div key={stat.label} className="stat-card animate-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                    {stat.icon}
                  </div>
                  <TrendingUp size={16} color="var(--gray-300)" />
                </div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <div style={{ fontSize: "12px", color: stat.color, fontWeight: 600, marginTop: "8px" }}>{stat.change}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="card animate-in" style={{ animationDelay: "0.4s" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, marginBottom: "20px" }}>Quick Actions</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {quickActions.map((action) => (
                  <a key={action.label} href={action.href} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "8px", background: "var(--gray-50)", border: "1px solid var(--gray-100)", fontSize: "14px", fontWeight: 500, color: "var(--black)", transition: "all 0.15s ease", textDecoration: "none" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: `${action.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: action.color, flexShrink: 0 }}>
                      {action.icon}
                    </div>
                    {action.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="card animate-in" style={{ animationDelay: "0.5s" }}>
              <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "16px", fontWeight: 800, marginBottom: "4px" }}>Platform Overview</h3>
              <p style={{ fontSize: "13px", color: "var(--gray-400)", marginBottom: "20px" }}>Aurexia capital platform status</p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {overviewItems.map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--gray-100)" }}>
                    <span style={{ fontSize: "13px", color: "var(--gray-500)", fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}