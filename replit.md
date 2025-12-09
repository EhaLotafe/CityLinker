# CityLinker Lubumbashi - Documentation Technique

## 🌍 Vue d'ensemble

CityLinker est une plateforme numérique complète (Fullstack) conçue pour connecter les entreprises, les prestataires de services et les clients à Lubumbashi (RDC). Elle fonctionne comme un annuaire interactif avec un système de géolocalisation, d'avis vérifiés et de gestion de contenu.

L'application est construite comme un **Monorepo** combinant un Frontend React performant et un Backend Express robuste.

---

## 🏗️ Architecture Système

### Frontend (Client)
L'interface utilisateur est construite pour être réactive et mobile-first.

*   **Framework** : React 18 (Vite).
*   **Langage** : TypeScript.
*   **Styling** : Tailwind CSS + Shadcn/ui (Radix UI).
*   **Gestion d'état & API** : TanStack Query (React Query) pour le cache et les requêtes.
*   **Routing** : Wouter (léger et rapide).
*   **Formulaires** : React Hook Form + Zod (Validation).

### Backend (Serveur)
Une API RESTful solide et sécurisée.

*   **Runtime** : Node.js.
*   **Framework** : Express.js.
*   **Base de Données** : PostgreSQL (Hébergé sur Supabase).
*   **ORM** : Drizzle ORM (Type-safe, performant).
*   **Authentification** : Sessions express (stockées en DB via `connect-pg-simple`) + Passport.js + Bcrypt.

### Déploiement & Infrastructure
*   **Hébergement App** : Render (Web Service).
*   **Hébergement DB** : Supabase (PostgreSQL).
*   **CI/CD** : Déploiement automatique via GitHub sur la branche `main`.

---

## 💾 Schéma de Base de Données

Les données sont structurées autour de 4 tables principales (définies dans `shared/schema.ts`) :

1.  **`users`** :
    *   Gère les comptes (Clients, Business, Admin).
    *   Stocke les profils entreprises (Nom, Adresse, Téléphone, Vérification).
    *   Rôles : `client`, `business`, `admin`.

2.  **`publications`** :
    *   Le contenu principal (Annonces, Services, Articles).
    *   Workflow de validation : `pending` -> `approved` / `rejected`.
    *   Compteurs de vues et métadonnées.

3.  **`categories`** :
    *   Structure de navigation (Resto, BTP, Santé, etc.).
    *   Icônes mappées côté client.

4.  **`reviews`** :
    *   Système de notation (1-5 étoiles) et commentaires.
    *   Lié à un utilisateur et une publication.

---

## 🔐 Sécurité & Authentification

*   **Mots de passe** : Hachés avec `bcrypt` avant stockage.
*   **Sessions** : Cookies HTTP-Only sécurisés (inaccessibles via JS).
*   **Protection CSRF/XSS** : Gérée par les middlewares Express et React.
*   **Autorisations** : Middleware `requireRole('admin')` ou `requireRole('business')` sur les routes sensibles.
*   **Validation** : Toutes les entrées API sont validées par Zod (schémas partagés).

---

## 🚀 Guide de Démarrage (Local)

Pour lancer le projet sur votre machine :

1.  **Installation des dépendances**
    ```bash
    npm install
    ```

2.  **Configuration Environnement**
    Créer un fichier `.env` à la racine avec :
    ```env
    DATABASE_URL=postgresql://postgres:[PWD]@db.[PROJECT].supabase.co:5432/postgres
    SESSION_SECRET=votre_cle_secrete_complexe
    NODE_ENV=development
    ```

3.  **Mise à jour de la Base de Données**
    ```bash
    npm run db:push   # Pousse le schéma
    npm run db:seed   # Injecte les données de test (Lubumbashi)
    ```

4.  **Lancement**
    ```bash
    npm run dev
    ```
    L'application sera disponible sur `http://localhost:5000`.

---

## 📦 Scripts Utiles (`package.json`)

*   `npm run dev` : Lance le serveur en mode développement (rechargement à chaud).
*   `npm run build` : Compile le Frontend et le Backend pour la production.
*   `npm start` : Lance le serveur de production (nécessite le build).
*   `npm run db:push` : Met à jour la structure de la base de données.
*   `npm run db:seed` : La base avec des données initiales.

---

## 🛠️ Stack Technique Détail

| Catégorie | Technologie | Usage |
| :--- | :--- | :--- |
| **Langage** | TypeScript | Typage strict partout (Front & Back). |
| **UI Kit** | Shadcn/ui | Composants accessibles et beaux par défaut. |
| **CSS** | Tailwind | Styling rapide et maintenable. |
| **API Client** | React Query | Gestion intelligente du cache et des états de chargement. |
| **Routing** | Wouter | Routing simple pour SPA. |
| **Date** | date-fns | Formatage des dates. |
| **Icônes** | Lucide React | Icônes vectorielles légères. |

*Document mis à jour le 08 Décembre 2025 pour la version 1.0 (Lancement Lubumbashi).*

# CityLinker

## Overview

CityLinker is a digital platform that connects businesses, service providers, and clients - similar to Yelp but designed specifically for African markets and SMEs. The platform enables users to discover, search, evaluate, and interact with local services through an intuitive interface featuring business listings, reviews, ratings, and categorized directories.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data persistence and session-based authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for component-based UI
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens

**Design System:**
- Custom Tailwind configuration with HSL-based color system supporting light/dark themes
- Typography: Inter (UI elements) and Lora (content headings) from Google Fonts
- Responsive grid patterns: 1/2/3 columns for business listings, 1/2/4 for featured content
- Consistent spacing using Tailwind's 4/6/8/12/16/20/24 scale
- Component elevation system using shadow utilities

**State Management:**
- React Context for authentication state (`AuthContext`) and theme preferences (`ThemeContext`)
- TanStack Query for all server data with custom `queryClient` configuration
- Session-based user state persisted on server, checked via `/api/auth/me` endpoint

**Key Frontend Patterns:**
- Protected routes via role-based access control (client, business, admin)
- Form validation using React Hook Form with Zod schema validation
- Optimistic updates with query invalidation after mutations
- Custom hooks for mobile detection and toast notifications

### Backend Architecture

**Technology Stack:**
- Express.js with TypeScript for REST API
- Drizzle ORM for type-safe database queries
- PostgreSQL as primary database
- Express-session with connect-pg-simple for session storage
- bcrypt for password hashing

**API Structure:**
- RESTful endpoints under `/api/*` namespace
- Session-based authentication with HTTP-only cookies
- Role-based middleware (`requireAuth`, `requireRole`) for authorization
- Shared Zod schemas between client and server for validation

**Data Access Layer:**
- Storage abstraction layer (`IStorage` interface) for database operations
- Drizzle schema definitions in `shared/schema.ts` with Zod validators
- Database migrations managed via Drizzle Kit
- Connection pooling via `pg` Pool

**Authentication Flow:**
- Registration with role selection (client, business, admin)
- Login creates session with userId stored in session data
- Session persisted in PostgreSQL via `connect-pg-simple`
- 7-day session expiry with secure cookies in production

### Database Schema

**Core Tables:**
- `users`: Stores user accounts with role-based fields (client, business, admin)
  - Business users have additional fields: businessName, businessDescription, businessAddress, etc.
- `categories`: Service/business categories with icons and descriptions
- `publications`: Multi-purpose content (announcements, services, articles)
  - Status workflow: pending → approved/rejected (admin moderation)
  - Includes view tracking and category association
- `reviews`: User reviews with ratings (1-5 stars) and comments linked to publications

**Enums:**
- `user_role`: client | business | admin
- `publication_status`: pending | approved | rejected
- `publication_type`: announcement | service | article

**Relationships:**
- Publications belong to users (creator) and optionally to categories
- Reviews belong to users (reviewer) and publications
- Cascading deletes on user removal

### Key Features

**Multi-Role System:**
- **Visitors (unauthenticated)**: Browse public content, view ratings, search listings
- **Clients**: All visitor features plus commenting, rating, profile management
- **Businesses**: Create/manage publications, view analytics, respond to reviews
- **Admins**: User management, publication moderation, platform statistics

**Publication Workflow:**
- Business users create publications (announcements/services/articles)
- Admin review required (pending status by default)
- Approved publications appear in search and trending sections
- View counting for analytics

**Search & Discovery:**
- Full-text search across publications
- Category-based filtering
- Type filtering (announcement/service/article)
- Trending algorithm based on recent views and ratings
- Advanced filtering with mobile-responsive sheets

**Review System:**
- Star ratings (1-5) with half-star display support
- Optional text comments
- Aggregate ratings calculated per publication
- Review count displayed on cards

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Headless UI primitives for accessible components (dialogs, dropdowns, tooltips, etc.)
- **Shadcn/ui**: Pre-built component library built on Radix with Tailwind styling
- **Lucide React**: Icon library for consistent iconography

### Database & ORM
- **PostgreSQL**: Primary relational database (connection via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database toolkit with schema-first approach
- **pg**: PostgreSQL client for Node.js with connection pooling

### Authentication & Security
- **bcrypt**: Password hashing (10 rounds)
- **express-session**: Session middleware with custom store
- **connect-pg-simple**: PostgreSQL session store for express-session

### Development Tools
- **Vite**: Frontend build tool with HMR and React plugin
- **esbuild**: Backend bundling for production builds
- **tsx**: TypeScript execution for development server

### Validation & Forms
- **Zod**: Schema validation shared between client and server
- **React Hook Form**: Form state management with Zod resolver
- **drizzle-zod**: Generate Zod schemas from Drizzle tables

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management for components
- **tailwind-merge**: Intelligent Tailwind class merging utility

### Other
- **date-fns**: Date formatting and manipulation
- **wouter**: Lightweight routing library for React
- **@tanstack/react-query**: Server state management with caching