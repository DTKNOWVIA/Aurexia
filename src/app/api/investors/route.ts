import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/rbac";
import { ROLES } from "@/lib/rbac";

async function GET(req: NextRequest, payload: any) {
  try {
    const investors = await prisma.investor.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ investors });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function POST(req: NextRequest, payload: any) {
  try {
    const { name, institution, email, ticketSize, geography, mandate } =
      await req.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email required" },
        { status: 400 }
      );
    }

    const investor = await prisma.investor.create({
      data: {
        name,
        institution,
        email,
        ticketSize,
        geography,
        mandate,
      },
    });

    return NextResponse.json({ investor }, { status: 201 });
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
  ROLES.INVESTMENT_MANAGER,
]);

export { GET_HANDLER as GET, POST_HANDLER as POST };