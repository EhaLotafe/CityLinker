// // server/seed.ts
// import { db } from "./db";
// import { users, categories, publications } from "@shared/schema";
// import { eq } from "drizzle-orm"; // Ajout de eq pour des recherches précises
// import bcrypt from "bcrypt";

// async function seed() {
//   console.log("🌱 Seeding database...");

//   // 1. CATEGORIES
//   const existingCategories = await db.select().from(categories);
//   if (existingCategories.length === 0) {
//     console.log("creating categories...");
//     await db.insert(categories).values([
//       { name: "Restauration", icon: "utensils", description: "Restaurants, cafés, traiteurs" },
//       { name: "Santé", icon: "stethoscope", description: "Médecins, cliniques, pharmacies" },
//       { name: "Éducation", icon: "graduation", description: "Écoles, formations, cours particuliers" },
//       { name: "Automobile", icon: "car", description: "Garages, vente de véhicules, locations" },
//       { name: "Construction", icon: "hammer", description: "BTP, artisans, rénovation" },
//       { name: "Mode", icon: "shirt", description: "Vêtements, accessoires, bijoux" },
//       { name: "Beauté", icon: "sparkles", description: "Salons de coiffure, spa, cosmétiques" },
//       { name: "Immobilier", icon: "home", description: "Agences, locations, ventes" },
//       { name: "Services Pro", icon: "briefcase", description: "Consulting, comptabilité, juridique" },
//       { name: "Voyages", icon: "plane", description: "Agences de voyage, hôtels, tourisme" },
//       { name: "Commerce", icon: "shopping", description: "Boutiques, supermarchés, e-commerce" },
//       { name: "Entreprises", icon: "building", description: "Services B2B, fournitures" },
//     ]);
//     console.log("✅ Categories created!");
//   } else {
//     console.log("⏩ Categories already exist, skipping...");
//   }

//   // 2. ADMIN USER
//   const [existingAdmin] = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, "admin@citylinker.com"));

//   if (!existingAdmin) {
//     console.log("creating admin user...");
//     const hashedPassword = await bcrypt.hash("admin123", 10);
//     await db.insert(users).values({
//       email: "admin@citylinker.com",
//       password: hashedPassword,
//       firstName: "Admin",
//       lastName: "CityLinker",
//       role: "admin",
//       businessVerified: true,
//     });
//     console.log("✅ Admin user created! (admin@citylinker.com / admin123)");
//   } else {
//     console.log("⏩ Admin already exists, skipping...");
//   }

//   // 3. BUSINESS USER & PUBLICATIONS
//   const [existingBusiness] = await db
//     .select()
//     .from(users)
//     .where(eq(users.email, "business@example.com"));

//   if (!existingBusiness) {
//     console.log("creating sample business...");
//     const hashedPassword = await bcrypt.hash("business123", 10);
//     const [business] = await db.insert(users).values({
//       email: "business@example.com",
//       password: hashedPassword,
//       firstName: "Jean",
//       lastName: "Dupont",
//       role: "business",
//       businessName: "Tech Solutions CI",
//       businessDescription: "Entreprise spécialisée dans les solutions technologiques innovantes",
//       businessAddress: "Abidjan, Cocody",
//       businessPhone: "+225 01 02 03 04",
//       businessVerified: true,
//     }).returning();

//     const cats = await db.select().from(categories);
//     const techCategory = cats.find(c => c.name === "Services Pro");

//     if (business && techCategory) {
//       await db.insert(publications).values([
//         {
//           userId: business.id,
//           categoryId: techCategory.id,
//           type: "service",
//           title: "Développement d'applications mobiles",
//           description: "Nous créons des applications mobiles sur mesure pour iOS et Android. Solutions innovantes et performantes.",
//           content: "Notre équipe d'experts développe des applications mobiles de haute qualité...",
//           price: "À partir de 500 000 FCFA",
//           location: "Abidjan",
//           status: "approved",
//           views: 150,
//         } as any, // Cast 'as any' pour éviter les erreurs strictes d'Enum TS
//         {
//           userId: business.id,
//           categoryId: techCategory.id,
//           type: "announcement",
//           title: "Offre spéciale site web",
//           description: "Création de site web professionnel à prix réduit pendant tout le mois. Profitez-en !",
//           price: "150 000 FCFA",
//           location: "Abidjan, Côte d'Ivoire",
//           status: "approved",
//           views: 89,
//         } as any,
//         {
//           userId: business.id,
//           categoryId: techCategory.id,
//           type: "article",
//           title: "Les tendances tech en Afrique 2024",
//           description: "Découvrez les innovations technologiques qui transforment le continent africain.",
//           content: "L'Afrique connaît une révolution technologique sans précédent...",
//           status: "approved",
//           views: 234,
//         } as any,
//       ]);
//       console.log("✅ Sample business and publications created!");
//     }
//   } else {
//     console.log("⏩ Sample business already exists, skipping...");
//   }

//   console.log("🌱 Seeding complete!");
//   process.exit(0);
// }

// seed().catch((err) => {
//   console.error("❌ Seed error:", err);
//   process.exit(1);
// });
// Note: The above seed file is commented out to prevent accidental execution.
import { db } from "./db";
import { users, categories, publications } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Seeding database for Lubumbashi context...");

  // 1. CATEGORIES (Kept as is, they are good generic categories)
  const existingCategories = await db.select().from(categories);
  if (existingCategories.length === 0) {
    console.log("creating categories...");
    await db.insert(categories).values([
      { name: "Restauration", icon: "utensils", description: "Restaurants, Malewa, Fast-food" },
      { name: "Santé", icon: "stethoscope", description: "Cliniques, Pharmacies, Médecins" },
      { name: "Éducation", icon: "graduation", description: "Écoles, Universités, Formations" },
      { name: "Automobile", icon: "car", description: "Garages, Vente pièces, Lavage" },
      { name: "Construction", icon: "hammer", description: "BTP, Quincailleries, Artisans" },
      { name: "Mode & Beauté", icon: "shirt", description: "Boutiques, Salons de coiffure" },
      { name: "Immobilier", icon: "home", description: "Agences, Ventes parcelles, Locations" },
      { name: "Services Pro", icon: "briefcase", description: "Consulting, Bureaux, Impression" },
      { name: "Voyage & Hôtels", icon: "plane", description: "Agences de voyage, Hôtels" },
      { name: "Technologie", icon: "sparkles", description: "Vente téléphones, Réparation, Cyber" },
    ]);
    console.log("✅ Categories created!");
  }

  // 2. ADMIN (Kept as is)
  const [existingAdmin] = await db.select().from(users).where(eq(users.email, "admin@citylinker.cd"));
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.insert(users).values({
      email: "admin@citylinker.cd",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "CityLinker",
      role: "admin",
      businessVerified: true,
    });
    console.log("✅ Admin user created!");
  }

  // 3. BUSINESS LUBUMBASHI (Tech Solutions) - (Kept as is)
  const [existingBusiness] = await db.select().from(users).where(eq(users.email, "contact@techlushi.cd"));
  if (!existingBusiness) {
    const hashedPassword = await bcrypt.hash("business123", 10);
    const [business] = await db.insert(users).values({
      email: "contact@techlushi.cd",
      password: hashedPassword,
      firstName: "Michel",
      lastName: "Kasongo",
      role: "business",
      businessName: "Lushi Tech Services",
      businessDescription: "Maintenance informatique et vente de matériel au cœur de Lubumbashi.",
      businessAddress: "Av. Kasa-Vubu, Centre-ville, Lubumbashi",
      businessPhone: "+243 99 00 00 000",
      businessVerified: true,
    }).returning();

    const cats = await db.select().from(categories);
    const techCategory = cats.find(c => c.name === "Technologie");

    if (business && techCategory) {
      await db.insert(publications).values([
        {
          userId: business.id,
          categoryId: techCategory.id,
          type: "service",
          title: "Maintenance Informatique Entreprise",
          description: "Contrat de maintenance pour vos ordinateurs et réseaux. Intervention rapide partout à Lubumbashi.",
          content: "Nous proposons des services complets : nettoyage virus, installation Windows, configuration réseau...",
          price: "Sur devis",
          location: "Lubumbashi, Gombe",
          status: "approved",
          views: 150,
        } as any,
        {
          userId: business.id,
          categoryId: techCategory.id,
          type: "announcement",
          title: "Promo : Laptop HP Core i5",
          description: "Arrivage de PC portables venant d'Europe. Prix imbattable pour la rentrée !",
          price: "350 $",
          location: "Centre-ville, Lubumbashi",
          status: "approved",
          views: 89,
        } as any,
      ]);
    }
  }

  // 4. BUSINESS LUBUMBASHI (Restaurant) - (Kept as is)
  const [restoBusiness] = await db.select().from(users).where(eq(users.email, "resto@simba.cd"));
  if (!restoBusiness) {
    const hashedPassword = await bcrypt.hash("business123", 10);
    const [business] = await db.insert(users).values({
      email: "resto@simba.cd",
      password: hashedPassword,
      firstName: "Sarah",
      lastName: "Mwamba",
      role: "business",
      businessName: "Le Goût du Katanga",
      businessDescription: "Cuisine locale authentique et grillades.",
      businessAddress: "Route Kinsevera, Lubumbashi",
      businessPhone: "+243 81 00 00 000",
      businessVerified: true,
    }).returning();

    const cats = await db.select().from(categories);
    const foodCategory = cats.find(c => c.name === "Restauration");

    if (business && foodCategory) {
      await db.insert(publications).values([
        {
          userId: business.id,
          categoryId: foodCategory.id,
          type: "announcement",
          title: "Buffet spécial dimanche",
          description: "Venez déguster notre buffet à volonté chaque dimanche. Poulet, Samoussa, Fumbwa...",
          price: "25 000 FC", // Common local currency
          location: "Lubumbashi, Golf", // Residential area
          status: "approved",
          views: 240,
        } as any,
      ]);
    }
  }
  
  // --- NOUVEAUX AJOUTS POUR PLUS DE RÉALISME LOCAL ---

  // 5. BUSINESS LUBUMBASHI (Santé - Clinique HJ style)
  const [cliniqueBusiness] = await db.select().from(users).where(eq(users.email, "contact@hjclinique.cd"));
  if (!cliniqueBusiness) {
    const hashedPassword = await bcrypt.hash("business123", 10);
    const [business] = await db.insert(users).values({
      email: "contact@hjclinique.cd",
      password: hashedPassword,
      firstName: "Dr. Jean-Pierre",
      lastName: "Ilunga",
      role: "business",
      businessName: "HJ Clinique Lubumbashi",
      businessDescription: "Services de santé de qualité, consultations spécialisées et imagerie médicale.",
      businessAddress: "7577, Avenue de la Révolution, en face du restaurant La Bonne Fourchette",
      businessPhone: "+243 81 211 8453",
      businessVerified: true,
    }).returning();

    const cats = await db.select().from(categories);
    const healthCategory = cats.find(c => c.name === "Santé");

    if (business && healthCategory) {
      await db.insert(publications).values([
        {
          userId: business.id,
          categoryId: healthCategory.id,
          type: "service",
          title: "Offre Check-up complet à 50$",
          description: "Profitez d'un bilan de santé complet incluant plusieurs examens pour seulement 50 USD. Offre spéciale !", // Realistic pricing in USD
          price: "50 $",
          location: "Lubumbashi, Centre-ville",
          status: "approved",
          views: 310,
        } as any,
      ]);
    }
  }

  // 6. BUSINESS LUBUMBASHI (Construction - Quincaillerie Congo Futur style)
  const [btpBusiness] = await db.select().from(users).where(eq(users.email, "sales@batimentexpress.cd"));
  if (!btpBusiness) {
    const hashedPassword = await bcrypt.hash("business123", 10);
    const [business] = await db.insert(users).values({
      email: "sales@batimentexpress.cd",
      password: hashedPassword,
      firstName: "Fabrice",
      lastName: "Kyungu",
      role: "business",
      businessName: "Bâtiment Express Lushi",
      businessDescription: "Importation et vente de matériaux de construction (ciment, tôles, fers à béton).",
      businessAddress: "Quartier Industriel, près de la Gécamines",
      businessPhone: "+243 97 123 4567",
      businessVerified: true,
    }).returning();

    const cats = await db.select().from(categories);
    const constructionCategory = cats.find(c => c.name === "Construction");

    if (business && constructionCategory) {
      await db.insert(publications).values([
        {
          userId: business.id,
          categoryId: constructionCategory.id,
          type: "announcement",
          title: "Arrivage Ciment Gris Lukala",
          description: "Stock important de ciment CILU 42.5. Prix de gros disponible. Livraison possible sur chantier.",
          price: "Sur demande",
          location: "Lubumbashi, Kampemba",
          status: "approved",
          views: 500,
        } as any,
      ]);
    }
  }

    // 7. BUSINESS LUBUMBASHI (Mode & Beauté - Salon de quartier)
    const [beauteBusiness] = await db.select().from(users).where(eq(users.email, "contact@tendanceplus.cd"));
    if (!beauteBusiness) {
        const hashedPassword = await bcrypt.hash("business123", 10);
        const [business] = await db.insert(users).values({
        email: "contact@tendanceplus.cd",
        password: hashedPassword,
        firstName: "Chantal",
        lastName: "Lunda",
        role: "business",
        businessName: "Tendance Plus Coiffure",
        businessDescription: "Salon de coiffure mixte, tresses africaines, soins capillaires et manucure.",
        businessAddress: "Avenue Kisale, Commune Kenya",
        businessPhone: "+243 85 987 6543",
        businessVerified: false, // Not verified yet
        }).returning();

        const cats = await db.select().from(categories);
        const modeCategory = cats.find(c => c.name === "Mode & Beauté");

        if (business && modeCategory) {
        await db.insert(publications).values([
            {
            userId: business.id,
            categoryId: modeCategory.id,
            type: "service",
            title: "Pose de Tresses (Nattes) Style Libre",
            description: "Expertise en tresses africaines de tous styles. Prenez rendez-vous via WhatsApp.",
            price: "À partir de 15 000 FC",
            location: "Lubumbashi, Kenya",
            status: "pending", // Waiting for approval
            views: 45,
            } as any,
        ]);
        }
    }


  console.log("🌱 Seeding complete with richer Lubumbashi Data!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
