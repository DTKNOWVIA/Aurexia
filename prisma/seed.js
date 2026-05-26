require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to run the seed script.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run the seed script.");
  }

  await prisma.documentPermission.deleteMany();
  await prisma.dataRoomAccess.deleteMany();
  await prisma.dataRoomFolder.deleteMany();
  await prisma.dataRoom.deleteMany();
  await prisma.reportJob.deleteMany();
  await prisma.report.deleteMany();
  await prisma.accessLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.iCMemo.deleteMany();
  await prisma.document.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.investor.deleteMany();
  await prisma.fund.deleteMany();
  await prisma.user.deleteMany();

  const password = bcrypt.hashSync("password", 10);

  const users = await Promise.all([
    prisma.user.create({ data: { email: "admin@aurexia.com", password, role: "SUPER_ADMIN" } }),
    prisma.user.create({ data: { email: "partner@aurexia.com", password, role: "GP_PARTNER" } }),
    prisma.user.create({ data: { email: "cio@aurexia.com", password, role: "CIO" } }),
    prisma.user.create({ data: { email: "im@aurexia.com", password, role: "INVESTMENT_MANAGER" } }),
    prisma.user.create({ data: { email: "analyst@aurexia.com", password, role: "ANALYST" } }),
    prisma.user.create({ data: { email: "esg@aurexia.com", password, role: "ESG_COMPLIANCE" } }),
    prisma.user.create({ data: { email: "legal@aurexia.com", password, role: "LEGAL" } }),
    prisma.user.create({ data: { email: "investor@horizonpension.com", password, role: "LP" } }),
    prisma.user.create({ data: { email: "ceo@zuluminerals.com", password, role: "OPERATOR" } }),
    prisma.user.create({ data: { email: "advisor@apexlegal.com", password, role: "ADVISOR" } }),
  ]);

  const fund = await prisma.fund.create({
    data: {
      name: "Aurexia Fund I",
      vintage: 2026,
      targetSizeUsd: 300000000,
      status: "FUNDRAISING",
    },
  });

  const investors = await Promise.all([
    prisma.investor.create({ data: { name: "Horizon Pension Fund", institution: "Horizon Pension Fund", email: "investor@horizonpension.com", ticketSize: 25000000, geography: "South Africa", mandate: "Energy transition and infrastructure", status: "QUALIFIED" } }),
    prisma.investor.create({ data: { name: "Nkosi Family Office", institution: "Nkosi Family Office", email: "nkosi@familyoffice.com", ticketSize: 15000000, geography: "Southern Africa", mandate: "critical minerals growth", status: "LEAD" } }),
  ]);

  const assets = await Promise.all([
    prisma.asset.create({ data: { name: "Zulu South", commodity: "Lithium", country: "Zimbabwe", stage: "DILIGENCE", capitalNeed: 18000000, readinessScore: 82 } }),
    prisma.asset.create({ data: { name: "Mokala Ridge", commodity: "Manganese", country: "South Africa", stage: "PORTFOLIO", capitalNeed: 12000000, readinessScore: 76 } }),
    prisma.asset.create({ data: { name: "Kafue North", commodity: "Nickel", country: "Zambia", stage: "SCREENING", capitalNeed: 22000000, readinessScore: 63 } }),
    prisma.asset.create({ data: { name: "Etango East", commodity: "Graphite", country: "Namibia", stage: "IC", capitalNeed: 15000000, readinessScore: 71 } }),
  ]);

  const dataRoom = await prisma.dataRoom.create({
    data: {
      name: "Aurexia Fund I LP Room",
      description: "Fundraising diligence room",
      fundId: fund.id,
    },
  });

  const folder = await prisma.dataRoomFolder.create({
    data: {
      name: "Technical Studies",
      dataRoomId: dataRoom.id,
    },
  });

  const document = await prisma.document.create({
    data: {
      name: "DFS Summary",
      storageKey: "dfs-summary.pdf",
      assetId: assets[0].id,
      folderId: folder.id,
    },
  });

  await prisma.documentPermission.create({
    data: {
      documentId: document.id,
      organizationId: investors[0].id,
      permission: "DOWNLOAD",
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
    },
  });

  await prisma.dataRoomAccess.create({
    data: {
      investorId: investors[0].id,
      dataRoomId: dataRoom.id,
      permission: "VIEW",
      expiresAt: new Date("2026-12-31T23:59:59.000Z"),
    },
  });

  await prisma.iCMemo.create({
    data: {
      title: "Zulu South IC Memo",
      content: "Approve subject to final offtake term sheet.",
      status: "DRAFT",
    },
  });

  await prisma.comment.create({
    data: {
      body: "Need revised offtake pricing assumptions.",
      userId: users[4].id,
      assetId: assets[0].id,
    },
  });

  await prisma.notification.create({
    data: {
      title: "IC approval pending – Zulu South",
      body: "A new IC memo is awaiting review.",
      userId: users[1].id,
    },
  });

  await prisma.notification.create({
    data: {
      title: "New document uploaded – DFS Summary",
      body: "A new document has been added to the Zulu South room.",
      userId: users[7].id,
    },
  });

  await prisma.notification.create({
    data: {
      title: "LP report ready for download",
      body: "A new LP report has been generated for Aurexia Fund I.",
      userId: users[7].id,
    },
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
