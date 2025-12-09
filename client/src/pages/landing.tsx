//client/src/pages/landing.tsx
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, Building2, Users, Star, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PublicationCard } from "@/components/publication-card";
import { CategoryGrid } from "@/components/category-card";
import { useState } from "react";
import { useLocation } from "wouter";
import type { PublicationWithDetails, Category } from "@shared/schema";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: trendingPublications, isLoading: loadingPublications } = useQuery<
    PublicationWithDetails[]
  >({
    queryKey: ["/api/publications/trending"],
  });

  const { data: categories, isLoading: loadingCategories } = useQuery<
    (Category & { count: number })[]
  >({
    queryKey: ["/api/categories"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="relative min-h-[600px] lg:min-h-[700px] flex flex-col">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10">
          <Navbar transparent />
        </div>

        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Connectez-vous aux{" "}
                <span className="text-blue-300">meilleurs services</span> près de chez vous
              </h1>
              <p className="mt-6 text-lg md:text-xl text-blue-100/90 leading-relaxed">
                CityLinker est la plateforme digitale qui met en relation entreprises, 
                prestataires et clients. Découvrez, recherchez et interagissez avec 
                des services de confiance.
              </p>

              <form onSubmit={handleSearch} className="mt-8 flex gap-3 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher un service, une entreprise..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-base rounded-full bg-white/95 backdrop-blur border-0 shadow-xl"
                    data-testid="input-hero-search"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-8 rounded-full shadow-xl"
                  data-testid="button-hero-search"
                >
                  Rechercher
                </Button>
              </form>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-blue-100/80 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>+500 entreprises</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>+10 000 utilisateurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  <span>+25 000 avis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-background">
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Tendances du moment
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Découvrez les services et annonces les plus populaires
                </p>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/search" data-testid="link-see-all-trending">
                  Voir tout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loadingPublications ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="aspect-video rounded-t-md" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : trendingPublications && trendingPublications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {trendingPublications.slice(0, 8).map((publication) => (
                  <PublicationCard key={publication.id} publication={publication} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  Aucune publication disponible pour le moment.
                </p>
              </Card>
            )}

            <div className="mt-8 sm:hidden">
              <Button variant="outline" asChild className="w-full">
                <Link href="/search">
                  Voir toutes les publications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Explorer par catégorie
              </h2>
              <p className="mt-2 text-muted-foreground">
                Trouvez exactement ce que vous cherchez
              </p>
            </div>

            {loadingCategories ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6 flex flex-col items-center gap-3">
                      <Skeleton className="w-14 h-14 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <CategoryGrid categories={categories} />
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  Aucune catégorie disponible.
                </p>
              </Card>
            )}
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Pourquoi choisir CityLinker ?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Une plateforme pensée pour vous
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Services vérifiés
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Toutes les entreprises sont validées par notre équipe pour garantir 
                    qualité et fiabilité.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Avis authentiques
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Des évaluations réelles de vrais clients pour vous aider à faire 
                    le bon choix.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-8 pb-6 px-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Simple et rapide
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Une interface intuitive pour trouver et contacter les prestataires 
                    en quelques clics.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary to-blue-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <Globe className="h-12 w-12 mx-auto text-white/80 mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à développer votre activité ?
            </h2>
            <p className="text-lg text-blue-100/90 mb-8 max-w-2xl mx-auto">
              Rejoignez des centaines d'entreprises qui font confiance à CityLinker 
              pour atteindre de nouveaux clients.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="w-full sm:w-auto"
                data-testid="button-cta-client"
              >
                <Link href="/register?role=client">Je suis client</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto bg-white/10 border-white/30 text-white backdrop-blur-sm hover:bg-white/20"
                data-testid="button-cta-business"
              >
                <Link href="/register?role=business">Je suis une entreprise</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
