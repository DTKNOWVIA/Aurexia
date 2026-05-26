import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    const users = await prisma.user.findMany({
      where: {
        ...(role && { role }),
      },
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function PATCH(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { role } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: "Role required" },
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

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "UPDATE_USER_ROLE",
        resourceType: "User",
        resourceId: id,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function DELETE(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    if (id === payload.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "DELETE_USER",
        resourceType: "User",
        resourceId: id,
      },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

const GET_HANDLER = withAuth(GET, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
]);

const PATCH_HANDLER = withAuth(PATCH, [
  ROLES.SUPER_ADMIN,
]);

const DELETE_HANDLER = withAuth(DELETE, [
  ROLES.SUPER_ADMIN,
]);

export {
  GET_HANDLER as GET,
  PATCH_HANDLER as PATCH,
  DELETE_HANDLER as DELETE,
};