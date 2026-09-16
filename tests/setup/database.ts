import { execSync } from "node:child_process";

process.env.DATABASE_URL = "file:./test.db";

execSync("pnpm exec prisma migrate deploy", {
  stdio: "inherit",
});
