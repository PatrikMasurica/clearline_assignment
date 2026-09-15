import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

const seedRequests = [
  {
    clientName: "Mira Tiles",
    existingScope: null,
    clientMessage:
      "We need a new website for our tile company. It should include company information, services, a gallery, and contact details. We would like it live in 3 weeks. Our logo is ready, but photos and final text are not ready yet. We may want Google Ads later. What do you need from us to get started?",
  },
  {
    clientName: "Luma Cleaning",
    existingScope:
      "Existing delivered website and contact form. Maintenance covers bug fixes and monthly checks.",
    clientMessage:
      "The contact form on our website has been showing errors since yesterday. It was working last week. We have not requested any new fields or integrations. Can you check what is wrong?",
  },
  {
    clientName: "Arta Interiors",
    existingScope:
      "Existing 5-page informational website with a contact form. Accounts, bookings, and payments are excluded from the current scope.",
    clientMessage:
      "We want to add user accounts, appointment booking, and online deposit payments to the website. We would like this done in 2 weeks and consider it a small change that should be included.",
  },
];

async function main() {
  await prisma.request.deleteMany();

  await prisma.request.createMany({
    data: seedRequests,
  });

  console.log(`Seeded ${seedRequests.length} requests.`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });