import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function POST_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { fundId: string } }
) {
  try {
    const { fundId } = params;
    const fund = await prisma.fund.findUnique({ where: { id: fundId } });

    if (!fund) {
      return NextResponse.json({ error: "Fund not found" }, { status: 404 });
    }

    const job = await prisma.reportJob.create({
      data: {
        jobType: "LP_EXPORT",
        targetId: fundId,
        requestedById: payload.userId,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "EXPORT_LP_REPORT",
        resourceType: "Fund",
        resourceId: fundId,
      },
    });

    return NextResponse.json({ jobId: job.id, status: job.status });
  } catch (error) {
    console.error("LP report export error:", error);
    return NextResponse.json(
      { error: "Unable to queue LP report export" },
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
