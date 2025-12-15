// api/db.ts
import "dotenv/config"; 
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
// CORRECTION CRITIQUE : Ajout de .js pour que Vercel trouve le fichier
import * as schema from "../shared/schema.js"; 

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL obligatoire pour Supabase en production
  ssl: { rejectUnauthorized: false },
  // 1 connexion max pour ne pas saturer en mode Serverless
  max: 1, 
  idleTimeoutMillis: 3000,
});

pool.on('error', (err) => {
  console.error('❌ Erreur client DB:', err);
});

export const db = drizzle(pool, { schema });