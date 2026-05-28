import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth, ROLES } from "@/lib/rbac";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

async function GET(req: NextRequest, payload: any) {
  try {
    const { searchParams } = new URL(req.url);
    const assetId = searchParams.get("assetId");
    const investorId = searchParams.get("investorId");

    const documents = await prisma.document.findMany({
      where: {
        ...(assetId && { assetId }),
        ...(investorId && { investorId }),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function POST(req: NextRequest, payload: any) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const assetId = formData.get("assetId") as string;
    const investorId = formData.get("investorId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "File required" },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name}`;
    const supabase = getSupabaseClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Document storage is not configured" },
        { status: 503 }
      );
    }

    const uploadPayload = new Uint8Array(fileBuffer);
    const { data, error } = await supabase.storage
      .from("aurexia-documents")
      .upload(fileName, uploadPayload, {
        contentType: file.type || "application/octet-stream",
      });

    if (error) {
      return NextResponse.json(
        { error: "File upload failed" },
        { status: 500 }
      );
    }

    const document = await prisma.document.create({
      data: {
        name: file.name,
        storageKey: fileName,
        assetId: assetId || null,
        investorId: investorId || null,
      },
    });

    return NextResponse.json({ document }, { status: 201 });
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
  ROLES.LEGAL,
  ROLES.LP,
]);

const POST_HANDLER = withAuth(POST, [
  ROLES.SUPER_ADMIN,
  ROLES.GP_PARTNER,
  ROLES.LEGAL,
  ROLES.INVESTMENT_MANAGER,
]);

export { GET_HANDLER as GET, POST_HANDLER as POST };
