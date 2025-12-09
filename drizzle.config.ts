import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Charge les variables du fichier .env
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL est manquant. Vérifiez votre fichier .env");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});