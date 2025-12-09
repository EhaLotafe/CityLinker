// server/db.ts
import "dotenv/config"; // <--- CETTE LIGNE EST INDISPENSABLE
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Nous passons "pool" directement. 
// Note : Si l'erreur de type persiste à cause d'une version spécifique de @types/pg, 
// le cast "as any" ici est sûr car Drizzle gère nativement le Pool pg à l'exécution.
export const db = drizzle(pool, { schema });