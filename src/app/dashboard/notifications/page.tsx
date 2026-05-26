/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Check, CheckCheck, Trash2, Archive } from "lucide-react";
import Sidebar from "@/components/Sidebar";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Notification {
  id: string;
  title: string;
  body: string | null;
  readAt: string | null;
  userId: string;
  createdAt: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState("ALL");
  const [markingRead, setMarkingRead] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (token: string) => {
    try {
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data.notifications || []);
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
    fetchNotifications(token);
  }, [router, fetchNotifications]);

  async function handleMarkAsRead(notificationId: string) {
    setMarkingRead(notificationId);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/notifications?id=${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? data.notification : notif
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMarkingRead(null);
    }
  }

  async function handleMarkAllAsRead() {
    const token = localStorage.getItem("token");
    const unreadNotifications = notifications.filter((n) => !n.readAt);

    try {
      await Promise.all(
        unreadNotifications.map((notif) =>
          fetch(`/api/notifications?id=${notif.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        )
      );

      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          readAt: notif.readAt || new Date().toISOString(),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = notifications.filter((notif) => {
    const matchesSearch =
      notif.title?.toLowerCase().includes(search.toLowerCase()) ||
      notif.body?.toLowerCase().includes(search.toLowerCase());
    const matchesRead =
      filterRead === "ALL" ||
      (filterRead === "UNREAD" && !notif.readAt) ||
      (filterRead === "READ" && notif.readAt);
    return matchesSearch && matchesRead;
  });

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const readCount = notifications.filter((n) => n.readAt).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
      <Sidebar active="Notifications" user={user} />

      <div className="main-layout">
        <header className="main-header">
          <div>
            <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "20px", fontWeight: 800, color: "var(--black)" }}>Notifications</h2>
            <p style={{ fontSize: "13px", color: "var(--gray-400)" }}>Platform alerts and activity updates</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="btn btn-outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: unreadCount === 0 ? 0.5 : 1,
                cursor: unreadCount === 0 ? "not-allowed" : "pointer",
              }}
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          </div>
        </header>

        <main className="main-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Total Notifications</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--black)" }}>
                {notifications.length}
              </div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Unread</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--blue)" }}>
                {unreadCount}
              </div>
            </div>
            <div className="card" style={{ padding: "16px" }}>
              <div style={{ fontSize: "12px", color: "var(--gray-500)", marginBottom: "8px", fontWeight: 600 }}>Read</div>
              <div style={{ fontFamily: "Syne, sans-serif", fontSize: "28px", fontWeight: 800, color: "var(--emerald)" }}>
                {readCount}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "24px", alignItems: "flex-end" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gray-400)" }} />
              <input
                className="input"
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: "40px" }}
              />
            </div>

            <div>
              <label className="input-label" style={{ marginBottom: "6px" }}>Filter</label>
              <select
                className="input"
                value={filterRead}
                onChange={(e) => setFilterRead(e.target.value)}
                style={{ cursor: "pointer", minWidth: "140px" }}
              >
                <option value="ALL">All</option>
                <option value="UNREAD">Unread</option>
                <option value="READ">Read</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
              <Bell size={48} style={{ margin: "0 auto 16px", color: "var(--gray-300)" }} />
              <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--gray-500)", marginBottom: "8px" }}>No notifications found</p>
              <p style={{ fontSize: "14px", color: "var(--gray-400)" }}>
                {search ? "Try adjusting your search" : "You're all caught up!"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {filtered.map((notif) => (
                <div
                  key={notif.id}
                  className="card"
                  style={{
                    padding: "16px",
                    background: notif.readAt ? "white" : "var(--blue)08",
                    borderLeft: `4px solid ${notif.readAt ? "var(--gray-200)" : "var(--blue)"}`,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "4px" }}>
                        <h3
                          style={{
                            fontFamily: "Syne, sans-serif",
                            fontSize: "15px",
                            fontWeight: notif.readAt ? 600 : 800,
                            color: "var(--black)",
                            flex: 1,
                          }}
                        >
                          {notif.title}
                        </h3>
                        {!notif.readAt && (
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: "var(--blue)",
                              flexShrink: 0,
                              marginTop: "6px",
                            }}
                          />
                        )}
                      </div>

                      {notif.body && (
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--gray-600)",
                            lineHeight: "1.5",
                            marginBottom: "8px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {notif.body}
                        </p>
                      )}

                      <div style={{ fontSize: "12px", color: "var(--gray-400)" }}>
                        {formatDate(notif.createdAt)}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      {!notif.readAt && (
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          disabled={markingRead === notif.id}
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
                            justifyContent: "center",
                            opacity: markingRead === notif.id ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--blue)15";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "none";
                          }}
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {notif.readAt && (
                        <div
                          style={{
                            color: "var(--emerald)",
                            padding: "4px 8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title="Read"
                        >
                          <CheckCheck size={16} />
                        </div>
                      )}
                      <button
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--gray-400)",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "var(--gray-100)";
                          (e.currentTarget as HTMLElement).style.color = "var(--danger)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "none";
                          (e.currentTarget as HTMLElement).style.color = "var(--gray-400)";
                        }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}