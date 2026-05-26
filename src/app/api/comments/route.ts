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
    const memoId = searchParams.get("memoId");

    const comments = await prisma.comment.findMany({
      where: {
        ...(assetId && { assetId }),
        ...(memoId && { memoId }),
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
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ comments });
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
    const { body, assetId, memoId } = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Comment body required" },
        { status: 400 }
      );
    }

    if (!assetId && !memoId) {
      return NextResponse.json(
        { error: "assetId or memoId required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        userId: payload.userId,
        assetId: assetId || null,
        memoId: memoId || null,
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
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "CREATE_COMMENT",
        resourceType: assetId ? "Asset" : "ICMemo",
        resourceId: assetId || memoId || "",
      },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function DELETE(
  req: NextRequest,
  payload: { userId: string; role: string }
) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Comment ID required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    if (
      comment.userId !== payload.userId &&
      payload.role !== ROLES.SUPER_ADMIN
    ) {
      return NextResponse.json(
        { error: "You can only delete your own comments" },
        { status: 403 }
      );
    }

    await prisma.comment.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 }
    );
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
  ROLES.ESG_COMPLIANCE,
  ROLES.LEGAL,
]);

const POST_HANDLER = withAuth(POST, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
  ROLES.ANALYST,
  ROLES.OPERATING_PARTNER,
  ROLES.ESG_COMPLIANCE,
  ROLES.LEGAL,
]);

const DELETE_HANDLER = withAuth(DELETE, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
  ROLES.ANALYST,
]);

export {
  GET_HANDLER as GET,
  POST_HANDLER as POST,
  DELETE_HANDLER as DELETE,
};