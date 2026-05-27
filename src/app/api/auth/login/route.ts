import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { authenticator } from "otplib";
import { prisma } from "@/lib/prisma";

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

    if (!user.mfaSecret) {
      const secret = authenticator.generateSecret();
      const otpauthUrl = authenticator.keyuri(email, "Aurexia", secret);
      await prisma.user.update({
        where: { id: user.id },
        data: { mfaSecret: secret },
      });

      return NextResponse.json({
        setupPending: true,
        otpauthUrl,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    }

    return NextResponse.json({
      mfaPending: true,
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Unable to sign in right now. Please try again shortly." },
      { status: 500 }
    );
  }
}
