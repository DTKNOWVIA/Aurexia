import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  GP_PARTNER: "GP_PARTNER",
  CIO: "CIO",
  INVESTMENT_MANAGER: "INVESTMENT_MANAGER",
  ANALYST: "ANALYST",
  OPERATING_PARTNER: "OPERATING_PARTNER",
  ESG_COMPLIANCE: "ESG_COMPLIANCE",
  LEGAL: "LEGAL",
  LP: "LP",
  OPERATOR: "OPERATOR",
  ADVISOR: "ADVISOR",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export function withAuth(
  handler: (
    req: NextRequest,
    payload: { userId: string; role: string },
    ...args: any[]
  ) => Promise<NextResponse>,
  allowedRoles?: AppRole[]
) {
  return async (req: NextRequest, ...args: any[]) => {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    if (allowedRoles && !allowedRoles.includes(payload.role as AppRole)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    return handler(req, payload, ...args);
  };
}