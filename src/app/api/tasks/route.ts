import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const assetId = searchParams.get("assetId");
    const assigneeId = searchParams.get("assigneeId");

    const tasks = await prisma.task.findMany({
      where: {
        ...(assetId && { assetId }),
        ...(assigneeId && { assigneeId }),
      },
      include: {
        asset: true,
        assignee: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tasks });
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
    const { title, assetId, assigneeId, dueDate } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        title,
        assetId: assetId || null,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: "PENDING",
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "CREATE_TASK",
        resourceType: "Task",
        resourceId: task.id,
      },
    });

    return NextResponse.json({ task }, { status: 201 });
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
]);

const POST_HANDLER = withAuth(POST, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.INVESTMENT_MANAGER,
  ROLES.ANALYST,
]);

export { GET_HANDLER as GET, POST_HANDLER as POST };