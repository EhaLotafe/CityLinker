import {
  users,
  categories,
  publications,
  reviews,
  type User,
  type InsertUser,
  type Category,
  type InsertCategory,
  type Publication,
  type InsertPublication,
  type Review,
  type InsertReview,
  type PublicationWithDetails,
  type ReviewWithUser,
} from "../shared/schema.js"; // Remonte d'un cran
import { db } from "./db.js"; // Import local (même dossier)
import { eq, desc, and, sql, ilike, or } from "drizzle-orm";


export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<void>; // <--- Ajouté ici

  // Categories
  getCategories(): Promise<(Category & { count: number })[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Publications
  getPublications(status?: string): Promise<PublicationWithDetails[]>;
  getPublicationById(id: number): Promise<PublicationWithDetails | undefined>;
  getPublicationsByUser(userId: number): Promise<PublicationWithDetails[]>;
  getTrendingPublications(limit?: number): Promise<PublicationWithDetails[]>;
  searchPublications(query?: string, type?: string, categoryId?: number): Promise<PublicationWithDetails[]>;
  createPublication(publication: InsertPublication): Promise<Publication>;
  updatePublication(id: number, data: Partial<InsertPublication & { status?: string }>): Promise<Publication | undefined>;
  deletePublication(id: number): Promise<void>;
  incrementPublicationViews(id: number): Promise<void>;

  // Reviews
  getReviewsByPublication(publicationId: number): Promise<ReviewWithUser[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Stats
  getAdminStats(): Promise<{
    totalUsers: number;
    totalBusinesses: number;
    totalClients: number;
    totalPublications: number;
    pendingPublications: number;
    totalReviews: number;
  }>;
  
  getBusinessStats(userId: number): Promise<{
    totalViews: number;
    totalReviews: number;
    averageRating: number;
    pendingCount: number;
    approvedCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // --- USERS ---
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: number): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // --- CATEGORIES ---
  async getCategories(): Promise<(Category & { count: number })[]> {
    const cats = await db.select().from(categories);
    const result = await Promise.all(
      cats.map(async (cat) => {
        const [countResult] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(publications)
          .where(and(eq(publications.categoryId, cat.id), eq(publications.status, "approved")));
        return { ...cat, count: countResult?.count || 0 };
      })
    );
    return result;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [cat] = await db.insert(categories).values(category).returning();
    return cat;
  }

  // Helper pour enrichir les publications avec user, category et rating
  private async enrichPublication(pub: Publication): Promise<PublicationWithDetails> {
    const [user] = await db.select().from(users).where(eq(users.id, pub.userId));
    const category = pub.categoryId
      ? (await db.select().from(categories).where(eq(categories.id, pub.categoryId)))[0]
      : null;
    const pubReviews = await db.select().from(reviews).where(eq(reviews.publicationId, pub.id));
    
    const averageRating =
      pubReviews.length > 0
        ? pubReviews.reduce((sum, r) => sum + r.rating, 0) / pubReviews.length
        : 0;

    // Sécurité: ne pas renvoyer le mot de passe
    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        return {
            ...pub,
            user: userWithoutPassword as any,
            category: category || null,
            reviews: pubReviews,
            averageRating,
            reviewCount: pubReviews.length,
        };
    } else {
        // Fallback si l'user a été supprimé
        return {
            ...pub,
            user: { firstName: "Utilisateur", lastName: "Inconnu" } as any,
            category: category || null,
            reviews: pubReviews,
            averageRating,
            reviewCount: pubReviews.length,
        }
    }
  }

  // --- PUBLICATIONS ---

  async getPublications(status?: string): Promise<PublicationWithDetails[]> {
    const pubs = status
      ? await db
          .select()
          .from(publications)
          .where(eq(publications.status, status as any))
          .orderBy(desc(publications.createdAt))
      : await db.select().from(publications).orderBy(desc(publications.createdAt));

    return Promise.all(pubs.map((pub) => this.enrichPublication(pub)));
  }

  async getPublicationById(id: number): Promise<PublicationWithDetails | undefined> {
    const [pub] = await db.select().from(publications).where(eq(publications.id, id));
    if (!pub) return undefined;
    return this.enrichPublication(pub);
  }

  async getPublicationsByUser(userId: number): Promise<PublicationWithDetails[]> {
    const pubs = await db
      .select()
      .from(publications)
      .where(eq(publications.userId, userId))
      .orderBy(desc(publications.createdAt));
    return Promise.all(pubs.map((pub) => this.enrichPublication(pub)));
  }

  async getTrendingPublications(limit = 8): Promise<PublicationWithDetails[]> {
    const pubs = await db
      .select()
      .from(publications)
      .where(eq(publications.status, "approved"))
      .orderBy(desc(publications.views))
      .limit(limit);
    return Promise.all(pubs.map((pub) => this.enrichPublication(pub)));
  }

  async searchPublications(
    query?: string,
    type?: string,
    categoryId?: number
  ): Promise<PublicationWithDetails[]> {
    // Construction dynamique des conditions
    const conditions = [eq(publications.status, "approved")];

    if (type && type !== "all") {
      conditions.push(eq(publications.type, type as any));
    }

    if (categoryId) {
      conditions.push(eq(publications.categoryId, categoryId));
    }

    if (query) {
      // Correction ici : On s'assure que le SQL généré n'est pas undefined
      const searchCondition = or(
        ilike(publications.title, `%${query}%`),
        ilike(publications.description, `%${query}%`)
      );
      
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    const pubs = await db
      .select()
      .from(publications)
      .where(and(...conditions))
      .orderBy(desc(publications.createdAt));

    return Promise.all(pubs.map((pub) => this.enrichPublication(pub)));
  }

  async createPublication(publication: InsertPublication): Promise<Publication> {
    const [pub] = await db.insert(publications).values(publication).returning();
    return pub;
  }

  async updatePublication(
    id: number,
    data: Partial<InsertPublication & { status?: string }>
  ): Promise<Publication | undefined> {
    const [pub] = await db
      .update(publications)
      .set(data as any) // Correction ici : 'as any' permet de passer le string vers l'Enum
      .where(eq(publications.id, id))
      .returning();
    return pub || undefined;
  }

  async deletePublication(id: number): Promise<void> {
    await db.delete(publications).where(eq(publications.id, id));
  }

  async incrementPublicationViews(id: number): Promise<void> {
    await db
      .update(publications)
      .set({ views: sql`${publications.views} + 1` })
      .where(eq(publications.id, id));
  }

  // --- REVIEWS ---

  async getReviewsByPublication(publicationId: number): Promise<ReviewWithUser[]> {
    const revs = await db
      .select()
      .from(reviews)
      .where(eq(reviews.publicationId, publicationId))
      .orderBy(desc(reviews.createdAt));

    return Promise.all(
      revs.map(async (rev) => {
        const [user] = await db.select().from(users).where(eq(users.id, rev.userId));
        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return { ...rev, user: userWithoutPassword as any };
        }
        // Fallback user inconnu
        return { ...rev, user: { firstName: "Utilisateur", lastName: "Inconnu" } as any };
      })
    );
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [rev] = await db.insert(reviews).values(review).returning();
    return rev;
  }

  // --- STATS ---

  async getAdminStats(): Promise<{
    totalUsers: number;
    totalBusinesses: number;
    totalClients: number;
    totalPublications: number;
    pendingPublications: number;
    totalReviews: number;
  }> {
    const [totalUsersResult] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
    const [totalBusinessesResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, "business"));
    const [totalClientsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, "client"));
    const [totalPublicationsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(publications);
    const [pendingPublicationsResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(publications)
      .where(eq(publications.status, "pending"));
    const [totalReviewsResult] = await db.select({ count: sql<number>`count(*)::int` }).from(reviews);

    return {
      totalUsers: totalUsersResult?.count || 0,
      totalBusinesses: totalBusinessesResult?.count || 0,
      totalClients: totalClientsResult?.count || 0,
      totalPublications: totalPublicationsResult?.count || 0,
      pendingPublications: pendingPublicationsResult?.count || 0,
      totalReviews: totalReviewsResult?.count || 0,
    };
  }

  async getBusinessStats(userId: number): Promise<{
    totalViews: number;
    totalReviews: number;
    averageRating: number;
    pendingCount: number;
    approvedCount: number;
  }> {
    const userPubs = await db
      .select()
      .from(publications)
      .where(eq(publications.userId, userId));

    const totalViews = userPubs.reduce((sum, p) => sum + p.views, 0);
    const pendingCount = userPubs.filter((p) => p.status === "pending").length;
    const approvedCount = userPubs.filter((p) => p.status === "approved").length;

    const pubIds = userPubs.map((p) => p.id);
    let totalReviews = 0;
    let totalRating = 0;

    if (pubIds.length > 0) {
      for (const pubId of pubIds) {
        const pubReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.publicationId, pubId));
        totalReviews += pubReviews.length;
        totalRating += pubReviews.reduce((sum, r) => sum + r.rating, 0);
      }
    }

    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    return {
      totalViews,
      totalReviews,
      averageRating,
      pendingCount,
      approvedCount,
    };
  }
}

export const storage = new DatabaseStorage();