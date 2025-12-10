// api/index.ts
import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from '../server/routes';

// Initialisation de l'application Express
const app = express();
const httpServer = createServer(app);

// Configuration de base (comme dans server/index.ts)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Variable pour éviter de ré-initialiser les routes à chaque requête (Cache)
let isInitialized = false;

// Fonction principale exportée pour Vercel
export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    // On enregistre les routes (Auth, API, etc.)
    await registerRoutes(httpServer, app);
    isInitialized = true;
  }

  // On passe la main à Express pour gérer la requête
  app(req, res);
}