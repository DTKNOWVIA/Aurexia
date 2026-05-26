import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, signToken } from "@/lib/auth";
import { ROLES } from "@/lib/rbac";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload || payload.role !== ROLES.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Only Super Admin can invite team members" },
        { status: 403 }
      );
    }

    const { email, role, temporaryPassword } = await req.json();

    if (!email || !role || !temporaryPassword) {
      return NextResponse.json(
        { error: "Email, role and temporary password required" },
        { status: 400 }
      );
    }

    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(role)) {
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

    const hashedPassword = await bcrypt.hash(temporaryPassword, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "INVITE_USER",
        resourceType: "User",
        resourceId: user.id,
      },
    });

    return NextResponse.json({
      message: `User invited successfully as ${role}`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      temporaryPassword,
    });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);

    if (!payload || payload.role !== ROLES.SUPER_ADMIN) {
      return NextResponse.json(
        { error: "Only Super Admin can view team members" },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}