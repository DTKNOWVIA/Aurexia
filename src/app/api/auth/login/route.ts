import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function generateMFACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "Database is not configured. Add DATABASE_URL to your .env file and restart the dev server." },
        { status: 503 }
      );
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate MFA code (valid for 15 minutes)
    const code = generateMFACode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Store MFA session
    const mfaSession = await prisma.mFASession.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    return NextResponse.json({
      mfaPending: true,
      userId: user.id,
      email: user.email,
      sessionId: mfaSession.id,
      message: "MFA code sent to your authenticator app",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
