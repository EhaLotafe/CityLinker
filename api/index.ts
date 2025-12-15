// api/index.ts
import { createServer } from 'http';
import express from 'express';
// On garde le .js pour Vercel
import { registerRoutes } from './routes.js'; 

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route de test simple
app.get('/api/health', (_req, res) => {
  res.json({ status: "OK", message: "Le serveur CityLinker est en ligne sur Vercel !" });
});

// DECLARATION UNIQUE (Ne pas écrire let isInitialized ailleurs)
let isInitialized = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isInitialized) {
      console.log("🚀 Initialisation des routes...");
      await registerRoutes(httpServer, app);
      isInitialized = true;
      console.log("✅ Serveur prêt.");
    }
    
    // On laisse Express gérer la requête
    app(req, res);
  } catch (error) {
    console.error("❌ Erreur au démarrage :", error);
    res.status(500).json({ 
      error: "Erreur interne du serveur", 
      message: error instanceof Error ? error.message : "Erreur inconnue" 
    });
  }
}