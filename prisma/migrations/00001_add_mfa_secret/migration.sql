-- Migration: add mfaSecret column to User
-- Adds an optional text column `mfaSecret` to store TOTP secrets

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "mfaSecret" TEXT;
