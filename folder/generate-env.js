// scripts/generate-env.js
const fs = require("fs");
const path = require("path");

const outDir = path.join(process.cwd(), "src", "environments");
const outFile = path.join(outDir, "environment.ts");

// Only put NON-SECRETS here. Anything in the bundle is public.
const apiBaseUrl = process.env.API_BASE_URL || "";

if (!apiBaseUrl) {
  console.error("Missing API_BASE_URL env var (set it in Netlify).");
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const contents = `export const environment = {
  production: true,
  apiBaseUrl: ${JSON.stringify(apiBaseUrl)},
};
`;

fs.writeFileSync(outFile, contents, "utf8");
console.log(`Wrote ${outFile}`);
