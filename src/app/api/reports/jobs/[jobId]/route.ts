import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  const job = await prisma.reportJob.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    return NextResponse.json({ error: "Report job not found" }, { status: 404 });
  }

  return NextResponse.json({ job });
}

export const GET = withAuth(GET_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
  ROLES.LP,
]);
