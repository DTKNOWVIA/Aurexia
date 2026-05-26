import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("reportType");
    const status = searchParams.get("status");

    const reports = await prisma.report.findMany({
      where: {
        ...(reportType && { reportType }),
        ...(status && { status }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ reports });
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
    const { title, reportType } = await req.json();

    if (!title || !reportType) {
      return NextResponse.json(
        { error: "Title and report type required" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        title,
        reportType,
        status: "PENDING",
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "CREATE_REPORT",
        resourceType: "Report",
        resourceId: report.id,
      },
    });

    return NextResponse.json({ report }, { status: 201 });
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
    const { status, storageKey } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Report ID required" },
        { status: 400 }
      );
    }

    const report = await prisma.report.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(storageKey && { storageKey }),
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "UPDATE_REPORT",
        resourceType: "Report",
        resourceId: id,
      },
    });

    return NextResponse.json({ report });
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
  ROLES.LP,
]);

const POST_HANDLER = withAuth(POST, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
]);

const PATCH_HANDLER = withAuth(PATCH, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
]);

export {
  GET_HANDLER as GET,
  POST_HANDLER as POST,
  PATCH_HANDLER as PATCH,
};