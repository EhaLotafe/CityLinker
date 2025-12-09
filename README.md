# 🌍 CityLinker Lubumbashi

**La plateforme numérique de référence pour connecter les entreprises et les habitants du Katanga.**

CityLinker est un annuaire moderne et intelligent (type Yelp/Pages Jaunes) adapté aux réalités de la RDC. Il permet de découvrir, noter et contacter des services locaux vérifiés à Lubumbashi.

![CityLinker Banner](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2672&auto=format&fit=crop)

---

## 🚀 Fonctionnalités Clés

### 👥 Pour les Utilisateurs (Clients)
- **🔍 Recherche Avancée :** Filtrage par catégorie, mots-clés et localisation (Golf, Centre-ville, Kenya...).
- **⭐ Système d'Avis :** Notes et commentaires pour partager son expérience.
- **📱 Mobile First :** Interface légère et rapide, optimisée pour les réseaux 3G/4G locaux.
- **📞 Contact Direct :** Boutons d'appel et WhatsApp intégrés.

### 🏢 Pour les Entreprises
- **📊 Tableau de Bord :** Gestion des annonces, suivi des vues et des statistiques.
- **💬 Gestion des Avis :** Possibilité de voir les retours clients.
- **✅ Badge "Vérifié" :** Gage de confiance pour les business authentiques.

### 🛡️ Administration
- **Validation :** Chaque publication est modérée avant d'être visible.
- **Gestion Utilisateurs :** Contrôle total sur les comptes inscrits.

---

## 🛠️ Stack Technique

Ce projet est un **Monorepo** (Frontend + Backend).  

- **Frontend :** React 18, TypeScript, Tailwind CSS, Shadcn/ui, TanStack Query, Wouter.  
- **Backend :** Node.js, Express, Passport.js (Sessions).  
- **Base de Données :** PostgreSQL (via Supabase), Drizzle ORM.  
- **Build Tool :** Vite (Client) + esbuild (Serveur).  

---

## 📦 Installation & Démarrage Local

### 1️⃣ Prérequis
- Node.js (v18 ou supérieur)  
- npm ou yarn  
- Un compte [Supabase](https://supabase.com) pour la base de données  

### 2️⃣ Cloner le dépôt
```bash
git clone https://github.com/EhaLotafe/CityLinker.git
cd CityLinker
````

### 3️⃣ Installer les dépendances

```bash
npm install
```

### 4️⃣ Configurer l'environnement

Créez un fichier `.env` à la racine du projet avec vos clés :

```env
# Lien de connexion à la base PostgreSQL
DATABASE_URL=postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.[ID_PROJET].supabase.co:5432/postgres

# Clé secrète pour les sessions
SESSION_SECRET=votre_secret_tres_complexe_lushi_2025

# Environnement
NODE_ENV=development
```

### 5️⃣ Initialiser la base de données

```bash
# Pousser la structure des tables
npm run db:push

# Injecter les données de démarrage (catégories, admin, entreprises exemples)
npm run db:seed
```

### 6️⃣ Lancer le projet

```bash
npm run dev
```

Le site sera accessible sur : [http://localhost:5000](http://localhost:5000)


## ☁️ Déploiement (Production)

Ce projet peut être hébergé sur **Render** ou tout autre service Node.js.

1. Connectez votre dépôt GitHub à Render.
2. Configurez les variables d'environnement :

```env
DATABASE_URL=<Lien Supabase Production>
SESSION_SECRET=<Votre clé secrète>
NODE_ENV=production
```

3. Paramètres Render :

* **Runtime :** Node
* **Build Command :** `npm install && npm run build`
* **Start Command :** `npm start`

---

## 📂 Structure du Projet

```text
citylinker/
├── client/             # Frontend (React)
│   ├── src/
│   │   ├── components/ # Composants UI (Shadcn)
│   │   ├── pages/      # Pages (Landing, Dashboard...)
│   │   └── lib/        # Utilitaires (Auth, API)
├── server/             # Backend (Express)
│   ├── routes.ts       # Routes API
│   ├── storage.ts      # Logique BDD (CRUD)
│   └── index.ts        # Point d'entrée serveur
├── shared/             # Code partagé (Types, Schéma DB)
└── drizzle/            # Migrations BDD
```

---

## 💾 Commandes Git pour pousser sur GitHub

# Initialiser le dépôt (si ce n'est pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit des modifications
git commit -m "Initial commit - CityLinker project"

# Ajouter le dépôt distant
git remote add origin https://github.com/EhaLotafe/CityLinker.git

# Vérifier les remotes
git remote -v

# Pousser sur la branche main
git branch -M main
git push -u origin main
```

---

Développé Chez Overcome Solution's par Eha Lotafe pour Lubumbashi, RDC. 🇨🇩

```

