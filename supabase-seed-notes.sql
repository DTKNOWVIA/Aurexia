-- Notes: example INSERTs you can paste into Supabase SQL Editor
-- Adjust column names if your database uses quoted identifiers

-- Create one admin user (adjust password hashing as needed)
INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'admin@aurexia.com', 'CHANGE_ME_HASHED_PASSWORD', 'ADMIN', NOW(), NOW());

-- Example investor
INSERT INTO "Investor" (id, name, institution, email, status, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Demo Investor', 'Demo Institution', 'investor@example.com', 'LEAD', NOW(), NOW());

-- Example asset
INSERT INTO "Asset" (id, name, commodity, country, stage, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Demo Mine', 'Lithium', 'South Africa', 'SOURCED', NOW(), NOW());

-- Example fund
INSERT INTO "Fund" (id, name, vintage, targetSizeUsd, status, "createdAt", "updatedAt")
VALUES (gen_random_uuid(), 'Demo Fund', 2026, 10000000, 'FUNDRAISING', NOW(), NOW());

-- Note: passwords must be hashed; the above uses a placeholder string. Prefer using the project's seed script which hashes passwords correctly.
