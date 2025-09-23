import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REACT_QUERY_FILE_PATH = path.join(__dirname, "../src/api/@tanstack/react-query.gen.ts");

function cleanupTanstackQueryFile() {
  try {
    let content = fs.readFileSync(REACT_QUERY_FILE_PATH, "utf8");

    content = content.replace(/export const (post|put|delete|patch)[A-Za-z0-9]+Options = \([^)]*\) => \{[\s\S]*?\n\};\n\n/g, "");

    content = content.replace(/export const (get)[A-Za-z0-9]+Mutation = \([^)]*\): UseMutationOptions[\s\S]*?\n\};\n\n/g, "");

    content = content.replace(/\n\n\n+/g, "\n\n");

    fs.writeFileSync(REACT_QUERY_FILE_PATH, content, "utf8");

    console.log("✅ TanStack Query file cleaned up successfully!");
    console.log("   - GET endpoints: queryOptions only (mutations removed)");
    console.log("   - POST/PUT/DELETE/PATCH endpoints: mutationOptions only (queryOptions removed)");
  } catch (error) {
    console.error("❌ Error cleaning up TanStack Query file:", error);
    process.exit(1);
  }
}

cleanupTanstackQueryFile();
