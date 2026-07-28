import { db, client } from "./index";
import fs from "fs";
import path from "path";

async function migrate() {
  console.log("Applying migrations...");
  
  // Read migration file
  const migrationPath = path.join(process.cwd(), "migrations", "0000_oval_hiroim.sql");
  const sql = fs.readFileSync(migrationPath, "utf8");
  
  // Split by statement-breakpoint
  const statements = sql.split("--> statement-breakpoint");
  
  for (let statement of statements) {
    statement = statement.trim();
    if (statement) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      try {
        await client.execute(statement);
      } catch (e) {
        console.error("Failed to execute statement:", e);
      }
    }
  }
  
  console.log("Migration complete!");
}

migrate().catch(console.error);
