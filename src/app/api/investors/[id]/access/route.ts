import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function POST_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { id: string } }
) {
  try {
    const investorId = params.id;
    const { dataRoomId, permission, expiresAt } = await req.json();

    if (!dataRoomId || !permission) {
      return NextResponse.json(
        { error: "dataRoomId and permission are required" },
        { status: 400 }
      );
    }

    const investor = await prisma.investor.findUnique({ where: { id: investorId } });
    const dataRoom = await prisma.dataRoom.findUnique({ where: { id: dataRoomId } });

    if (!investor || !dataRoom) {
      return NextResponse.json({ error: "Investor or data room not found" }, { status: 404 });
    }

    const access = await prisma.dataRoomAccess.create({
      data: {
        investorId,
        dataRoomId,
        permission,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "GRANT_DATA_ROOM_ACCESS",
        resourceType: "DataRoom",
        resourceId: dataRoomId,
      },
    });

    return NextResponse.json({ access }, { status: 201 });
  } catch (error) {
    console.error("Investor access error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(POST_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.INVESTMENT_MANAGER,
  ROLES.LEGAL,
]);
