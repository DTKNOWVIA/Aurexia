import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  const rooms = await prisma.dataRoom.findMany({
    include: {
      asset: true,
      fund: true,
      accessGrants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items: rooms });
}

async function POST_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { name, description, assetId, fundId } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Data room name is required" },
        { status: 400 }
      );
    }

    const room = await prisma.dataRoom.create({
      data: {
        name,
        description,
        assetId: assetId || null,
        fundId: fundId || null,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "CREATE_DATA_ROOM",
        resourceType: "DataRoom",
        resourceId: room.id,
      },
    });

    return NextResponse.json({ room }, { status: 201 });
  } catch (error) {
    console.error("Data room creation error:", error);
    return NextResponse.json(
      { error: "Unable to create data room" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(GET_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
  ROLES.ANALYST,
  ROLES.LEGAL,
]);

export const POST = withAuth(POST_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.INVESTMENT_MANAGER,
  ROLES.LEGAL,
]);
