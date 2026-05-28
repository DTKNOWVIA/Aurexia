"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

type User = { email: string; role: string };

export default function DashboardShell({
  active,
  title,
  subtitle,
  action,
  children,
}: {
  active: string;
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(storedUser) as User);
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
      return;
    }

    setToken(storedToken);
    setInitialized(true);
  }, [router]);

  if (!initialized) {
    return (
      <main className="flex h-full items-center justify-center" style={{ minHeight: "100vh" }}>
        <div className="text-gray">Loading workspace...</div>
      </main>
    );
  }

  if (!user || !token) {
    return (
      <main className="flex h-full items-center justify-center" style={{ minHeight: "100vh" }}>
        <div className="text-gray">Loading workspace...</div>
      </main>
    );
  }

  return (
    <>
      <Sidebar active={active} user={user} />
      <div className="main-layout">
        <header className="main-header">
          <div>
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </div>
          {action}
        </header>
        <main className="main-content">{children}</main>
      </div>
    </>
  );
}
