import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { sessionId, code } = await req.json();

    if (!sessionId || !code) {
      return NextResponse.json(
        { error: "Session ID and code required" },
        { status: 400 }
      );
    }

    // Find the MFA session
    const mfaSession = await prisma.mFASession.findUnique({
      where: { id: sessionId },
      include: { user: true },
    });

    if (!mfaSession) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    // Check if session has expired
    if (new Date() > mfaSession.expiresAt) {
      await prisma.mFASession.delete({ where: { id: sessionId } });
      return NextResponse.json(
        { error: "MFA code has expired. Please log in again." },
        { status: 401 }
      );
    }

    // Validate code
    if (mfaSession.code !== code.trim()) {
      return NextResponse.json(
        { error: "Invalid MFA code" },
        { status: 401 }
      );
    }

    // Code is valid - issue JWT token and clean up
    const token = signToken({
      userId: mfaSession.user.id,
      role: mfaSession.user.role,
    });

    // Delete the used MFA session
    await prisma.mFASession.delete({ where: { id: sessionId } });

    return NextResponse.json({
      token,
      user: {
        id: mfaSession.user.id,
        email: mfaSession.user.email,
        role: mfaSession.user.role,
      },
    });
  } catch (error) {
    console.error("MFA verification error:", error);
    return NextResponse.json(
      { error: "Unable to verify MFA code. Please try again." },
      { status: 500 }
    );
  }
}
