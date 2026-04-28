// Build script for the V1 Marketing Launcher worker.
// Bundles worker/index.ts into dist/worker.js using esbuild.
// npm packages stay external (resolved from node_modules at runtime).

import { build } from "esbuild";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

await build({
  entryPoints: [resolve(root, "worker/index.ts")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: resolve(root, "dist/worker.js"),
  packages: "external",
  tsconfig: resolve(root, "tsconfig.worker.json"),
  alias: {
    "@": resolve(root, "src"),
  },
  banner: {
    js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
  },
  logLevel: "info",
});

console.log("[build-worker] Worker built successfully → dist/worker.js");
