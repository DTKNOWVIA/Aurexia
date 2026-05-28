import jwt from "jsonwebtoken";
import type { AppRole } from "./rbac";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export function signToken(payload: { userId: string; role: AppRole }) {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET as string) as unknown as { userId: string; role: AppRole };
  } catch {
    return null;
  }
}