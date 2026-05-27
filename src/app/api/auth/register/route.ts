import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const PUBLIC_ROLES = ["LP", "OPERATOR", "ADVISOR"];

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "GP_PARTNER",
  "CIO",
  "INVESTMENT_MANAGER",
  "ANALYST",
  "OPERATING_PARTNER",
  "ESG_COMPLIANCE",
  "LEGAL",
];

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database is not configured. Add DATABASE_URL to your .env file and restart the dev server." },
        { status: 503 }
      );
    }

    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const requestedRole = role || "LP";

    // If requesting an admin role, verify the requester is a SUPER_ADMIN
    if (ADMIN_ROLES.includes(requestedRole)) {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json(
          { error: "Only Super Admin can create internal team accounts" },
          { status: 403 }
        );
      }

      const payload = verifyToken(token);

      if (!payload || payload.role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { error: "Only Super Admin can create internal team accounts" },
          { status: 403 }
        );
      }
    }

    // Public registration only allows public roles
    if (!PUBLIC_ROLES.includes(requestedRole) && !ADMIN_ROLES.includes(requestedRole)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, "Aurexia", secret);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: requestedRole,
        mfaSecret: secret,
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      setupPending: true,
      otpauthUrl,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Unable to create an account right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
