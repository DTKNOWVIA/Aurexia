import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { id: string } }
) {
  const { id: documentId } = params;

  const activity = await prisma.accessLog.findMany({
    where: {
      resourceType: "Document",
      resourceId: documentId,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ activity });
}

export const GET = withAuth(GET_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
  ROLES.LEGAL,
  ROLES.LP,
]);
