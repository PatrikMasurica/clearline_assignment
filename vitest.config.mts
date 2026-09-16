import { defineConfig } from "vitest/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup/database.ts"],
  },
  resolve: {
    alias: {
      "@": currentDir,
      "server-only": path.resolve(
        currentDir,
        "tests/mocks/server-only.ts",
      ),
    },
  },
});
