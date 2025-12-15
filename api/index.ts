import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from './routes.js'; // Import LOCAL (c'est ça qui répare l'erreur)

const app = express();
const httpServer = createServer(app);

app.get('/api/health', (req, res) => {
  res.json({ status: "OK", message: "Le serveur Vercel fonctionne !" });
});

let isInitialized = false;

export default async function handler(req: any, res: any) {
  try {
    if (!isInitialized) {
      console.log("🚀 Démarrage de l'initialisation des routes...");
      await registerRoutes(httpServer, app);
      isInitialized = true;
      console.log("✅ Routes initialisées avec succès");
    }
  } catch (error) {
    console.error("❌ Erreur fatale lors de l'initialisation des routes :", error);
    // On renvoie l'erreur au navigateur pour comprendre ce qui se passe
    return res.status(500).json({ 
      error: "Erreur de démarrage du serveur", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }

  app(req, res);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let isInitialized = false;

export default async function handler(req: any, res: any) {
  if (!isInitialized) {
    await registerRoutes(httpServer, app);
    isInitialized = true;
  }
  app(req, res);
}