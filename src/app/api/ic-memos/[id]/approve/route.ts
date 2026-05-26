import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function POST_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { decision, comment } = await req.json();

    if (!decision || !["APPROVED", "REJECTED"].includes(decision)) {
      return NextResponse.json(
        { error: "Decision must be APPROVED or REJECTED" },
        { status: 400 }
      );
    }

    const memo = await prisma.iCMemo.update({
      where: { id },
      data: {
        status: decision,
      },
    });

    if (comment) {
      await prisma.comment.create({
        data: {
          body: comment,
          userId: payload.userId,
          memoId: id,
        },
      });
    }

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "APPROVE_IC_MEMO",
        resourceType: "ICMemo",
        resourceId: id,
      },
    });

    return NextResponse.json({ memo });
  } catch (error) {
    console.error("IC memo approval error:", error);
    return NextResponse.json(
      { error: "Unable to approve memo" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(POST_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
]);
