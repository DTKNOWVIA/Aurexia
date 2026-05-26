import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET(req: NextRequest, payload: any) {
  try {
    const memos = await prisma.iCMemo.findMany({
      include: {
        comments: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ memos });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function POST(req: NextRequest, payload: any) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required" },
        { status: 400 }
      );
    }

    const memo = await prisma.iCMemo.create({
      data: {
        title,
        content,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ memo }, { status: 201 });
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
]);

const POST_HANDLER = withAuth(POST, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
]);

export { GET_HANDLER as GET, POST_HANDLER as POST };