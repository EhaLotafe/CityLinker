import { createServer } from 'http';
import express from 'express';
import { registerRoutes } from './routes'; // Import LOCAL (c'est ça qui répare l'erreur)

const app = express();
const httpServer = createServer(app);

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