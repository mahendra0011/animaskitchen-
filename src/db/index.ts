import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const { Pool } = pg;

// Connection pool with graceful handling for local/test/preview environments
const connectionString =
  process.env["DATABASE_URL"] || "postgresql://postgres:postgres@localhost:5432/animaskitchen";

// Check if SSL is actually required (e.g. Neon, Supabase, Render postgres with sslmode=require)
const isLocalhost =
  connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
const requiresSsl =
  !isLocalhost &&
  (process.env["DATABASE_URL"]?.includes("sslmode=require") ||
    process.env["PGSSLMODE"] === "require");

export const pool = new Pool({
  connectionString,
  ssl: requiresSsl ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const db = drizzle(pool, { schema });
