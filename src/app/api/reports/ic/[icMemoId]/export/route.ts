import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function POST_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { icMemoId: string } }
) {
  try {
    const { icMemoId } = params;
    const memo = await prisma.iCMemo.findUnique({ where: { id: icMemoId } });

    if (!memo) {
      return NextResponse.json({ error: "IC memo not found" }, { status: 404 });
    }

    const job = await prisma.reportJob.create({
      data: {
        jobType: "IC_EXPORT",
        targetId: icMemoId,
        requestedById: payload.userId,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "EXPORT_IC_REPORT",
        resourceType: "ICMemo",
        resourceId: icMemoId,
      },
    });

    return NextResponse.json({ jobId: job.id, status: job.status });
  } catch (error) {
    console.error("IC report export error:", error);
    return NextResponse.json(
      { error: "Unable to queue IC report export" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(POST_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
]);
