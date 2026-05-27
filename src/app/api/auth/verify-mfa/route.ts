import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: "User ID and code required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.mfaSecret) {
      return NextResponse.json(
        { error: "MFA is not configured for this account" },
        { status: 401 }
      );
    }

    const isValid = authenticator.check(code.trim(), user.mfaSecret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid MFA code" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
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
