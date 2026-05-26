"use client";

import { useEffect, useSyncExternalStore } from "react";
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
  const storedUser = useSyncExternalStore(
    () => () => undefined,
    () => (typeof window === "undefined" ? null : localStorage.getItem("user")),
    () => null
  );
  const token = useSyncExternalStore(
    () => () => undefined,
    () => (typeof window === "undefined" ? null : localStorage.getItem("token")),
    () => null
  );
  const user = storedUser ? (JSON.parse(storedUser) as User) : null;

  useEffect(() => {
    if (storedUser === null || token === null) {
      router.push("/login");
    }
  }, [router, storedUser, token]);

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
