import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

async function main() {
  console.log("Starting migration...");
  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed:", err);
  }
  process.exit(0);
}

main();
