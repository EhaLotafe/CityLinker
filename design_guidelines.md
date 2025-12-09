# CityLinker Design Guidelines VA

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from Yelp's directory UX, Airbnb's visual card system, and modern SaaS dashboards. This platform balances discovery (visual, engaging) with utility (search, management), requiring a professional yet approachable aesthetic suitable for African SME markets.

**Core Principle**: Trust through clarity—clean layouts, prominent social proof (ratings/reviews), and visual hierarchy that guides users effortlessly from discovery to action.

---

## Typography System

**Font Stack**: 
- Primary: Inter (Google Fonts) - for UI elements, buttons, navigation
- Secondary: Lora (Google Fonts) - for article/content headings to add warmth

**Hierarchy**:
- Hero Headings: 3xl to 5xl, font-bold
- Section Titles: 2xl to 3xl, font-semibold
- Card/Item Titles: lg to xl, font-medium
- Body Text: base, font-normal, leading-relaxed
- Metadata (ratings, dates): sm, font-normal, text-gray-600

---

## Layout & Spacing System

**Tailwind Units**: Consistently use 4, 6, 8, 12, 16, 20, 24 for spacing
- Component padding: p-4 to p-8
- Section spacing: py-12 (mobile), py-20 (desktop)
- Card gaps: gap-6 to gap-8
- Container max-width: max-w-7xl with px-4 to px-6

**Grid Patterns**:
- Business listings: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Featured content: grid-cols-1 md:grid-cols-2 lg:grid-cols-4
- Dashboard stats: grid-cols-1 md:grid-cols-2 lg:grid-cols-4

---

## Component Library

### Navigation
- **Landing Page**: Transparent/sticky navbar with logo left, "Inscription" + "Connexion" buttons right
- **Authenticated**: Top navbar with search bar (prominent), user avatar dropdown right
- **Mobile**: Hamburger menu with slide-in panel

### Cards (Business/Service/Article)
- Elevated with subtle shadow (shadow-md hover:shadow-lg)
- Image top (aspect-video), content below with padding-6
- Title, brief description (2 lines max, truncated), rating stars with count
- CTA button bottom-right or centered
- Hover: subtle lift transform and shadow enhancement

### Search & Filters
- Large search bar: rounded-full with icon left, height h-12 to h-14
- Filter chips below: pill-shaped, toggleable, with count badges
- Category dropdown: grid layout with icons for each category

### Ratings & Reviews
- Star display: Icon library stars (Font Awesome or Heroicons), filled/half/empty states
- Review cards: Avatar left, name/date/rating top, comment text, helpful button
- Summary: Large aggregate score (text-5xl), star breakdown bars

### Dashboards (Business/Admin)
- Sidebar navigation left (fixed, w-64), main content area right
- Stat cards: Icon, large number (text-3xl), label, trend indicator (up/down arrow)
- Charts: Use Chart.js placeholder areas with descriptive titles
- Data tables: Sticky headers, alternating row colors, action buttons right column

### Forms
- Input fields: h-12, rounded-lg, border-2 focus state with ring
- Labels: text-sm font-medium mb-2
- Submit buttons: Full-width on mobile, auto-width on desktop
- Validation: Inline error messages (text-red-600 text-sm)

### Buttons
- Primary CTA: px-6 py-3, rounded-lg, font-semibold, with hover lift
- Secondary: Outline variant with border-2
- **On Images**: Background blur (backdrop-blur-md), semi-transparent background
- Icon buttons: Square/circular, p-3, for actions like edit/delete

### Status Indicators
- Pending validation: Yellow badge with clock icon
- Approved: Green badge with checkmark
- Rejected: Red badge with X icon

---

## Page-Specific Layouts

### Landing Page
1. **Hero**: Full-width, h-screen or min-h-[600px], large search bar centered, headline + subheadline
2. **Trending Section**: 4-column grid of featured cards, "Voir plus" link right
3. **Categories**: 6-8 category cards with icons, 2-3 rows, clickable
4. **How It Works**: 3-column feature explanation with icons
5. **CTA Section**: Centered, bold headline, dual buttons (Client/Entreprise signup)
6. **Footer**: 4-column grid (About, Links, Contact, Social), copyright bottom

### Detail Pages (Annonce/Service/Article)
- Two-column layout (lg): Image gallery left (60%), details right (40%)
- Single column mobile: Images top, details below
- Sticky sidebar on desktop with booking/contact CTA
- Reviews section full-width below, paginated
- Related items carousel at bottom

### Business Dashboard
- Left sidebar: Navigation items with icons
- Main area: Welcome banner, 4 stat cards top, charts/tables below
- Publication management: Tabs (All/Pending/Approved), filterable table
- Create button: Fixed bottom-right on mobile, top-right on desktop

### Admin Dashboard
- Similar structure to business dashboard
- Validation queue: Card-based layout with approve/reject actions prominent
- User management: Searchable table with role badges
- Platform stats: Large numbers with trend graphs

---

## Images & Media

**Hero Image**: Yes - use a vibrant, high-quality image showing diverse African businesses/cityscapes with subtle overlay gradient (from transparent to semi-dark) to ensure text readability.

**Business Cards**: Featured image (landscape, aspect-video ratio), professional photos of storefronts, products, or services.

**Category Icons**: Use icon library (Heroicons recommended) - consistent style across all categories.

**Profile Avatars**: Circular, size-10 to size-12, with fallback to initials on colored background.

**Dashboard Icons**: Line-style icons from Heroicons for stats, navigation, and actions.

**Article/Content**: Support for embedded images within rich content, responsive sizing.

---

## Interactions & Animations

**Minimal Animation Strategy**:
- Card hover: Slight lift (translate-y-1) with shadow transition
- Button hover: Subtle scale (hover:scale-105)
- Page transitions: Simple fade-in on route change
- Star ratings: Quick fill animation on click
- Form validation: Shake animation on error
- No scroll-triggered animations, no parallax effects

---

## Accessibility & Consistency

- All interactive elements: min-height of 44px (tap target)
- Focus states: Visible ring-2 with color contrast
- Alt text for all images
- ARIA labels on icon-only buttons
- Semantic HTML throughout (nav, main, article, aside)
- Keyboard navigation support for all interactive elements
- Form inputs maintain consistent height (h-12) and padding (px-4)

---

**Design Philosophy**: Modern, clean, trustworthy. Prioritize content discovery with visual hierarchy, making it effortless for users to find businesses and for businesses to showcase their offerings. Balance professionalism with approachability—this is a platform that serves both established companies and emerging entrepreneurs across African markets.

# CityLinker Lubumbashi - Design Guidelines VF

## 1. Philosophie & Identité Visuelle

**Concept** : "L'Annuaire de Confiance du Katanga".
Le design doit inspirer la solidité, le professionnalisme et l'ancrage local. Nous nous éloignons du style "Start-up californienne" générique pour adopter une esthétique qui parle aux habitants de Lubumbashi : des couleurs riches, des contrastes forts et une lisibilité parfaite sur mobile.

**Principes Clés** :
1.  **Mobile First** : 80% des utilisateurs sont sur Android (Tecno/Infinix/Samsung). L'interface doit être légère et les boutons faciles à toucher.
2.  **Clarté** : Pas d'animations superflues. L'information (Prix, Adresse, Téléphone) doit être immédiate.
3.  **Confiance** : Utilisation intensive des badges de vérification et des avis pour rassurer.

---

## 2. Système de Couleurs (Palette Lushi)

Notre palette est inspirée des richesses du Katanga (le Cuivre) et du monde des affaires (Bleu).

### Couleurs Principales
| Nom | Hex | Usage |
| :--- | :--- | :--- |
| **Lubumbashi Blue** | `#003366` | **Primaire**. Navbar, Titres H1, Arrière-plans Hero. Inspire la confiance et l'institutionnel. |
| **Copper (Cuivre)** | `#D47A1C` | **Action**. Boutons d'appel à l'action (CTA), liens, icônes actives. Rappel de l'identité minière. |
| **Mining Yellow** | `#FFCC00` | **Accent**. Badges, Mises en avant, Étoiles de notation. |
| **Emerald Green** | `#009966` | **Succès**. Validations, Badges "Vérifié", Messages positifs. |

### Couleurs Neutres
| Nom | Hex | Usage |
| :--- | :--- | :--- |
| **Anthracite** | `#1D1D1F` | Textes de corps, Pied de page (Footer). |
| **Soft Gray** | `#F3F4F6` | Arrière-plans de section, fonds de cartes. |
| **White** | `#FFFFFF` | Fond des cartes, Inputs. |

---

## 3. Typographie

Nous utilisons une police géométrique moderne mais humaine, très lisible sur écran.

**Police Principale : Montserrat** (Google Fonts)
*   **Titres (H1, H2)** : `Montserrat Bold (700)` ou `SemiBold (600)`.
*   **Corps de texte** : `Montserrat Regular (400)`.
*   **Labels / Boutons** : `Montserrat Medium (500)`.

**Police Secondaire : Lora** (Google Fonts)
*   Utilisée uniquement pour les articles de blog ou les citations pour apporter une touche éditoriale.

---

## 4. Bibliothèque de Composants (UI Kit)

### Cartes (Listings)
*   **Style** : Fond blanc, ombre portée légère (`shadow-md`), bordure fine grise.
*   **Structure** : Image en haut (ratio 16:9), Titre gras, Badge de catégorie, Note étoiles, Adresse.
*   **Interaction** : Légère élévation au survol (`translate-y-1`).

### Boutons
*   **Primaire (Cuivre)** : Fond `#D47A1C`, Texte Blanc, Arrondi 6px (`rounded-md`).
*   **Secondaire (Outline)** : Fond transparent, Bordure `#003366`, Texte `#003366`.
*   **Ghost** : Pour la navigation, change de couleur au survol.

### Formulaires
*   **Inputs** : Hauteur 48px (facile à cliquer sur mobile), fond blanc, bordure grise. Focus ring couleur Cuivre.
*   **Labels** : Toujours au-dessus du champ, en gras léger.

### Navigation
*   **Desktop** : Navbar fixe blanche ou transparente (sur Hero). Liens clairs.
*   **Mobile** : Menu Hamburger latéral (Sheet) facile d'accès.

### Indicateurs de Statut
*   🟡 **En attente** : Badge Jaune + Icône Horloge.
*   🟢 **Approuvé** : Badge Vert + Icône Check.
*   🔴 **Rejeté** : Badge Rouge + Icône X.

---

## 5. Mises en Page (Layouts)

### Page d'Accueil (Landing)
1.  **Hero Header** : Fond Bleu Profond, Texte Blanc, Barre de recherche blanche flottante.
2.  **Catégories** : Grille de cartes simples avec icônes.
3.  **Tendances** : Carrousel ou Grille des tops entreprises.
4.  **Appel à l'action** : Section sombre incitant les entreprises à s'inscrire.

### Tableaux de Bord (Dashboards)
*   **Structure** : Sidebar fixe à gauche (Menu), Contenu à droite.
*   **Cartes de Stats** : 4 blocs en haut (Vues, Avis, etc.).
*   **Tableaux** : Liste des publications avec actions (Éditer, Supprimer) à droite.

---

## 6. Accessibilité & Performance

*   **Contraste** : Toujours vérifier que le texte blanc sur fond orange/bleu est lisible.
*   **Images** : Toujours définir une taille fixe ou un ratio pour éviter le "layout shift". Utiliser `object-cover`.
*   **Feedback** : Utiliser des "Toasts" (notifications flottantes) pour confirmer chaque action (Sauvegarde, Erreur).