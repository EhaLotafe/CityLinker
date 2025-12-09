// shared/schema.ts
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

/**
 * ENUMS
 */
export const userRoleEnum = pgEnum("user_role", [
  "client",
  "business",
  "admin",
]);
export const publicationStatusEnum = pgEnum("publication_status", [
  "pending",
  "approved",
  "rejected",
]);
export const publicationTypeEnum = pgEnum("publication_type", [
  "announcement",
  "service",
  "article",
]);

/**
 * USERS
 */
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),

  role: userRoleEnum("role").notNull().default("client"),

  // Champs business (optionnels)
  businessName: text("business_name"),
  businessDescription: text("business_description"),
  businessAddress: text("business_address"),
  businessPhone: text("business_phone"),
  businessWebsite: text("business_website"),
  businessImage: text("business_image"),

  businessVerified: boolean("business_verified")
    .default(false)
    .notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * CATEGORIES
 */
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
});

/**
 * PUBLICATIONS (annonces, services, articles)
 */
export const publications = pgTable("publications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),

  type: publicationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  slug: text("slug"),

  description: text("description").notNull(),
  content: text("content"),

  image: text("image"),
  price: text("price"),
  location: text("location"),

  status: publicationStatusEnum("status")
    .notNull()
    .default("pending"),

  rejectionReason: text("rejection_reason"),

  views: integer("views").notNull().default(0),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * REVIEWS
 */
export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  publicationId: integer("publication_id")
    .notNull()
    .references(() => publications.id, { onDelete: "cascade" }),

  rating: integer("rating").notNull(),
  comment: text("comment"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * RELATIONS
 */
export const usersRelations = relations(users, ({ many }) => ({
  publications: many(publications),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  publications: many(publications),
}));

export const publicationsRelations = relations(
  publications,
  ({ one, many }) => ({
    user: one(users, {
      fields: [publications.userId],
      references: [users.id],
    }),
    category: one(categories, {
      fields: [publications.categoryId],
      references: [categories.id],
    }),
    reviews: many(reviews),
  })
);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  publication: one(publications, {
    fields: [reviews.publicationId],
    references: [publications.id],
  }),
}));

/**
 * SCHEMAS ZOD
 * Correction : Suppression de "id: true" car generatedAlwaysAsIdentity l'exclut déjà automatiquement
 */
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories);
// Si categories n'a que des champs obligatoires ou auto-générés (id), omit peut être vide ou retiré si aucun champ n'est à exclure manuellement.

export const insertPublicationSchema = createInsertSchema(
  publications
).omit({
  createdAt: true,
  updatedAt: true,
  views: true,
  status: true,
  rejectionReason: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  createdAt: true,
});

/**
 * LOGIN / REGISTER ZOD
 */
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6),
});

export const registerSchema = insertUserSchema.extend({
  email: z.string().email("Email invalide"),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(["client", "business"]),
});

/**
 * TYPES EXPORTÉS
 */
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Publication = typeof publications.$inferSelect;
export type InsertPublication = z.infer<typeof insertPublicationSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export type PublicationWithDetails = Publication & {
  user: User;
  category: Category | null;
  reviews: Review[];
  averageRating?: number;
  reviewCount?: number;
};

export type ReviewWithUser = Review & {
  user: User;
};