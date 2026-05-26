import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function POST_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { id: string } }
) {
  try {
    const { id: dataRoomId } = params;
    const { name, parentId } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      );
    }

    const folder = await prisma.dataRoomFolder.create({
      data: {
        name,
        dataRoomId,
        parentId: parentId || null,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "CREATE_FOLDER",
        resourceType: "DataRoomFolder",
        resourceId: folder.id,
      },
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error("Folder creation error:", error);
    return NextResponse.json(
      { error: "Unable to create folder" },
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
