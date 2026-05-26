#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const required = [
  'DATABASE_URL',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET'
];

let missing = [];
required.forEach((k) => {
  if (!process.env[k] || process.env[k].trim() === '') missing.push(k);
});

console.log('\nEnv validation for Aurexia\n-------------------------');
if (missing.length === 0) {
  console.log('All required env vars are present. ✅\n');
  console.log('Next steps:');
  console.log('- Run `npm install`');
  console.log('- Run `npx prisma generate` to build the client');
  console.log('- Run `npm run seed` to seed demo data (or use Supabase SQL Editor)');
  console.log('- Run `npm run dev` to start the dev server');
} else {
  console.log('Missing env vars: ' + missing.join(', '));
  console.log('\nPlease copy `.env.example` to `.env` and fill the missing values.');
  console.log('If you prefer not to run locally, set the same environment variables in Render.');
  process.exitCode = 2;
}
