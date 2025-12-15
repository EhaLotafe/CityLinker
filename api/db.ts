import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
// Note : Gardez l'extension .js si vous êtes en "type": "module" et que Vercel l'exigeait avant
// Sinon essayez sans. Ici je mets sans extension pour la compatibilité standard TS.
import * as schema from "../shared/schema"; 

console.log("🔌 Initialisation de la connexion DB...");

if (!process.env.DATABASE_URL) {
  console.error("❌ ERREUR CRITIQUE : DATABASE_URL est manquant dans les variables d'environnement !");
  throw new Error("DATABASE_URL must be set");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Indispensable pour Supabase sur Vercel
  max: 1, // Une seule connexion par lambda pour éviter de saturer Supabase
  idleTimeoutMillis: 3000,
});

pool.on('error', (err) => {
  console.error('❌ Erreur inattendue sur le client DB', err);
});

// Test de connexion simple
pool.connect().then(client => {
  console.log("✅ Connexion DB réussie !");
  client.release();
}).catch(err => {
  console.error("❌ Échec de la connexion DB :", err.message);
});

export const db = drizzle(pool, { schema });