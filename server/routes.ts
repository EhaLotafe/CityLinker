// server/routes.ts
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { 
  loginSchema, 
  registerSchema, 
  insertPublicationSchema, 
  insertReviewSchema,
  type RegisterInput,
  type LoginInput
} from "@shared/schema";
import bcrypt from "bcrypt";

// Extension du type Session pour inclure userId
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

// --- MIDDLEWARES ---

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Non authentifié" });
  }
  next();
};

const requireRole = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }
    next();
  };
};

// --- ROUTES ---

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Configuration de la session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "citylinker-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semaine
      },
    })
  );

  // 1. AUTHENTIFICATION
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = registerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      // Typage explicite pour éviter l'erreur "unknown"
      const data = result.data as RegisterInput;

      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Cet email est déjà utilisé" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;

      res.status(201).json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const data = result.data as LoginInput;

      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const { password: _, ...userWithoutPassword } = user;
      req.session.userId = user.id;

      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erreur lors de la déconnexion" });
      }
      res.json({ message: "Déconnecté avec succès" });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  app.patch("/api/auth/profile", requireAuth, async (req, res) => {
    try {
      const user = await storage.updateUser(req.session.userId!, req.body);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });

  // 2. PUBLIC DATA (Catégories, Publications)
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Get categories error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
    }
  });

  app.get("/api/publications", async (req, res) => {
    try {
      const publications = await storage.getPublications("approved");
      res.json(publications);
    } catch (error) {
      console.error("Get publications error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des publications" });
    }
  });

  app.get("/api/publications/trending", async (req, res) => {
    try {
      const publications = await storage.getTrendingPublications(8);
      res.json(publications);
    } catch (error) {
      console.error("Get trending error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des tendances" });
    }
  });

  app.get("/api/publications/search", async (req, res) => {
    try {
      const { q, type, category } = req.query;
      const publications = await storage.searchPublications(
        q as string,
        type as string,
        category ? parseInt(category as string) : undefined
      );
      res.json(publications);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Erreur lors de la recherche" });
    }
  });

  app.get("/api/publications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const publication = await storage.getPublicationById(id);
      if (!publication) {
        return res.status(404).json({ message: "Publication non trouvée" });
      }
      await storage.incrementPublicationViews(id);
      res.json(publication);
    } catch (error) {
      console.error("Get publication error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
  });

  // 3. REVIEWS
  app.get("/api/publications/:id/reviews", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reviews = await storage.getReviewsByPublication(id);
      res.json(reviews);
    } catch (error) {
      console.error("Get reviews error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des avis" });
    }
  });

  app.post("/api/publications/:id/reviews", requireAuth, requireRole("client"), async (req, res) => {
    try {
      const publicationId = parseInt(req.params.id);
      const result = insertReviewSchema.safeParse({
        ...req.body,
        userId: req.session.userId,
        publicationId,
      });
      
      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const review = await storage.createReview(result.data);
      res.status(201).json(review);
    } catch (error) {
      console.error("Create review error:", error);
      res.status(500).json({ message: "Erreur lors de la création de l'avis" });
    }
  });

  // 4. BUSINESS ROUTES
  app.post("/api/publications", requireAuth, requireRole("business"), async (req, res) => {
    try {
      const result = insertPublicationSchema.safeParse({
        ...req.body,
        userId: req.session.userId,
      });

      if (!result.success) {
        return res.status(400).json({ message: result.error.errors[0].message });
      }

      const publication = await storage.createPublication(result.data);
      res.status(201).json(publication);
    } catch (error) {
      console.error("Create publication error:", error);
      res.status(500).json({ message: "Erreur lors de la création" });
    }
  });

  app.patch("/api/publications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getPublicationById(id);
      
      if (!existing) {
        return res.status(404).json({ message: "Publication non trouvée" });
      }

      const user = await storage.getUser(req.session.userId!);
      if (existing.userId !== req.session.userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }

      const publication = await storage.updatePublication(id, {
        ...req.body,
        status: user?.role === "admin" ? req.body.status : "pending",
      });
      
      res.json(publication);
    } catch (error) {
      console.error("Update publication error:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
  });

  app.delete("/api/publications/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const existing = await storage.getPublicationById(id);
      
      if (!existing) {
        return res.status(404).json({ message: "Publication non trouvée" });
      }

      const user = await storage.getUser(req.session.userId!);
      if (existing.userId !== req.session.userId && user?.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }

      await storage.deletePublication(id);
      res.json({ message: "Publication supprimée" });
    } catch (error) {
      console.error("Delete publication error:", error);
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  });

  app.get("/api/business/publications", requireAuth, requireRole("business"), async (req, res) => {
    try {
      const publications = await storage.getPublicationsByUser(req.session.userId!);
      res.json(publications);
    } catch (error) {
      console.error("Get business publications error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
  });

  app.get("/api/business/stats", requireAuth, requireRole("business"), async (req, res) => {
    try {
      const stats = await storage.getBusinessStats(req.session.userId!);
      res.json(stats);
    } catch (error) {
      console.error("Get business stats error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  // 5. ADMIN ROUTES
  app.get("/api/admin/stats", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      console.error("Get admin stats error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  app.get("/api/admin/users", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPasswords = users.map(({ password: _, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
  });

  app.get("/api/admin/publications", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const publications = await storage.getPublications();
      res.json(publications);
    } catch (error) {
      console.error("Get admin publications error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
  });

  app.get("/api/admin/publications/pending", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const publications = await storage.getPublications("pending");
      res.json(publications);
    } catch (error) {
      console.error("Get pending publications error:", error);
      res.status(500).json({ message: "Erreur lors de la récupération" });
    }
  });

  // Validation des publications par l'Admin
  app.patch("/api/admin/publications/:id/status", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Statut invalide" });
      }

      const publication = await storage.updatePublication(id, { status });
      if (!publication) {
        return res.status(404).json({ message: "Publication non trouvée" });
      }

      res.json(publication);
    } catch (error) {
      console.error("Update status error:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
    }
  }); // <-- Fermeture corrigée ici

  // Modification d'un utilisateur par l'Admin
  app.patch("/api/admin/users/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const updatedUser = await storage.updateUser(id, req.body);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      console.error("Admin user update error:", error);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  });

  // Suppression d'un utilisateur par l'Admin
  app.delete("/api/admin/users/:id", requireAuth, requireRole("admin"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Sécurité : Empêcher la suppression de l'utilisateur admin connecté
      if (req.session.userId === id) {
          return res.status(403).json({ message: "Impossible de supprimer votre propre compte Admin" });
      }

      // NOTE: Assurez-vous que deleteUser est implémenté dans storage.ts
      if (storage.deleteUser) {
        await storage.deleteUser(id);
        res.json({ message: "Utilisateur supprimé" });
      } else {
        res.status(501).json({ message: "Fonctionnalité non implémentée dans le stockage" });
      }
      
    } catch (error) {
      console.error("Admin user delete error:", error);
      res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
  });

  return httpServer;
}