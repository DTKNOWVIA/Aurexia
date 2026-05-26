import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function GET_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      comments: true,
      documents: true,
    },
  });

  if (!asset) {
    return NextResponse.json({ error: "Asset not found" }, { status: 404 });
  }

  return NextResponse.json({ asset });
}

async function PATCH_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const update = await req.json();

    const data: any = {};
    if (update.name) data.name = update.name;
    if (update.commodity) data.commodity = update.commodity;
    if (update.country) data.country = update.country;
    if (update.stage) data.stage = update.stage;
    if (update.capitalNeed !== undefined) data.capitalNeed = Number(update.capitalNeed);
    if (update.readinessScore !== undefined) data.readinessScore = Number(update.readinessScore);

    const asset = await prisma.asset.update({
      where: { id },
      data,
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "UPDATE_ASSET",
        resourceType: "Asset",
        resourceId: id,
      },
    });

    return NextResponse.json({ asset });
  } catch (error) {
    console.error("Asset update error:", error);
    return NextResponse.json(
      { error: "Unable to update asset" },
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
  ROLES.OPERATING_PARTNER,
  ROLES.LEGAL,
]);

export const PATCH = withAuth(PATCH_HANDLER, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.CIO,
  ROLES.INVESTMENT_MANAGER,
]);
