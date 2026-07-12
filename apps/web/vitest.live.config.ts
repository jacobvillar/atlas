import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

// Explicit, opt-in configuration for checks that call the real OpenAI API.
// Keep this separate from the default test suite so local development and CI
// remain deterministic and do not consume the course API budget.
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.live.test.ts"],
  },
});
