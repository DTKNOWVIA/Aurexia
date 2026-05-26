import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: payload.userId,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function POST(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { title, body, userId } = await req.json();

    if (!title || !userId) {
      return NextResponse.json(
        { error: "Title and userId required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        body: body || null,
        userId,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
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

    if (!id) {
      return NextResponse.json(
        { error: "Notification ID required" },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ notification });
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
  ROLES.INVESTMENT_MANAGER,
  ROLES.ANALYST,
  ROLES.OPERATING_PARTNER,
  ROLES.ESG_COMPLIANCE,
  ROLES.LEGAL,
  ROLES.LP,
  ROLES.OPERATOR,
  ROLES.ADVISOR,
]);

const POST_HANDLER = withAuth(POST, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
]);

const PATCH_HANDLER = withAuth(PATCH, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
  ROLES.ANALYST,
  ROLES.OPERATING_PARTNER,
  ROLES.ESG_COMPLIANCE,
  ROLES.LEGAL,
  ROLES.LP,
  ROLES.OPERATOR,
  ROLES.ADVISOR,
]);

export {
  GET_HANDLER as GET,
  POST_HANDLER as POST,
  PATCH_HANDLER as PATCH,
};