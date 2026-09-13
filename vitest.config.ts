import { configDefaults, defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    // The browser suite under e2e is Playwright's, not Vitest's.
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
