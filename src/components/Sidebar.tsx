"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Pickaxe,
  FileText,
  FolderOpen,
  CheckSquare,
  BarChart2,
  Bell,
  UserCircle,
  ClipboardList,
  LogOut,
  BriefcaseBusiness,
  GitBranch,
  Calculator,
  Leaf,
  Search,
  Shield,
  PieChart,
} from "lucide-react";

interface SidebarProps {
  active: string;
  user: { email: string; role: string } | null;
}

export default function Sidebar({ active, user }: SidebarProps) {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={16} />, href: "/dashboard" },
    { label: "LP CRM", icon: <BriefcaseBusiness size={16} />, href: "/dashboard/lp-crm" },
    { label: "Pipeline", icon: <GitBranch size={16} />, href: "/dashboard/pipeline" },
    { label: "Investors", icon: <Users size={16} />, href: "/dashboard/investors" },
    { label: "Assets", icon: <Pickaxe size={16} />, href: "/dashboard/assets" },
    { label: "IC Memos", icon: <FileText size={16} />, href: "/dashboard/ic-memos" },
    { label: "Capital Structuring", icon: <Calculator size={16} />, href: "/dashboard/capital-structuring" },
    { label: "Portfolio", icon: <PieChart size={16} />, href: "/dashboard/portfolio" },
    { label: "ESG", icon: <Leaf size={16} />, href: "/dashboard/esg" },
    { label: "Data Rooms", icon: <Shield size={16} />, href: "/dashboard/data-rooms" },
    { label: "LP Portal", icon: <BarChart2 size={16} />, href: "/dashboard/lp-portal" },
    { label: "Documents", icon: <FolderOpen size={16} />, href: "/dashboard/documents" },
    { label: "Tasks", icon: <CheckSquare size={16} />, href: "/dashboard/tasks" },
    { label: "Reports", icon: <BarChart2 size={16} />, href: "/dashboard/reports" },
    { label: "Search", icon: <Search size={16} />, href: "/dashboard/search" },
    { label: "Notifications", icon: <Bell size={16} />, href: "/dashboard/notifications" },
  ];

  const adminItems = [
    { label: "Users", icon: <UserCircle size={16} />, href: "/dashboard/users" },
    { label: "Access Logs", icon: <ClipboardList size={16} />, href: "/dashboard/access-logs" },
    { label: "Device History", icon: <Shield size={16} />, href: "/dashboard/device-history" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "var(--blue)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "16px", color: "white" }}>A</span>
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "18px", color: "white", letterSpacing: "-0.02em" }}>AUREXIA</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Platform</div>
        {navItems.map((item) => (
          <a key={item.label} href={item.href} className={`nav-item ${active === item.label ? "active" : ""}`}>
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
        {(user?.role === "SUPER_ADMIN" || user?.role === "GP_PARTNER") && (
          <>
            <div className="nav-section-title">Admin</div>
            {adminItems.map((item) => (
              <a key={item.label} href={item.href} className={`nav-item ${active === item.label ? "active" : ""}`}>
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </>
        )}
      </nav>

      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", marginBottom: "8px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "var(--blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: 700,
            color: "white",
            flexShrink: 0,
          }}>
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
              {user?.role?.replace(/_/g, " ")}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
          style={{ width: "100%", color: "rgba(255,255,255,0.4)", fontSize: "13px", justifyContent: "flex-start", padding: "8px 12px", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </aside>
  );
}
