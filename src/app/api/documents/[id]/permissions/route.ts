import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";

async function POST_HANDLER(
  req: NextRequest,
  payload: { userId: string; role: string },
  { params }: { params: { id: string } }
) {
  try {
    const { id: documentId } = params;
    const { organizationId, permission, expiresAt } = await req.json();

    if (!organizationId || !permission) {
      return NextResponse.json(
        { error: "organizationId and permission are required" },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({ where: { id: documentId } });

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const docPermission = await prisma.documentPermission.create({
      data: {
        documentId,
        organizationId,
        permission,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    await prisma.accessLog.create({
      data: {
        userId: payload.userId,
        action: "GRANT_DOCUMENT_PERMISSION",
        resourceType: "Document",
        resourceId: documentId,
      },
    });

    return NextResponse.json({ permission: docPermission }, { status: 201 });
  } catch (error) {
    console.error("Document permission error:", error);
    return NextResponse.json(
      { error: "Unable to create document permission" },
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
