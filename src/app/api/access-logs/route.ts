import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const resourceType = searchParams.get("resourceType");
    const resourceId = searchParams.get("resourceId");
    const limit = searchParams.get("limit");

    const logs = await prisma.accessLog.findMany({
      where: {
        ...(userId && { userId }),
        ...(resourceType && { resourceType }),
        ...(resourceId && { resourceId }),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : 100,
    });

    return NextResponse.json({ logs });
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
  ROLES.ESG_COMPLIANCE,
  ROLES.LEGAL,
]);

export { GET_HANDLER as GET };