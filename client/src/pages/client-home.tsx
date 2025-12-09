//client/src/pages/client-home.tsx
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight, Filter } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PublicationCard } from "@/components/publication-card";
import { CategoryGrid } from "@/components/category-card";
import { useAuth } from "@/lib/auth";
import type { PublicationWithDetails, Category } from "@shared/schema";

export default function ClientHomePage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const { data: publications, isLoading: loadingPublications } = useQuery<
    PublicationWithDetails[]
  >({
    queryKey: ["/api/publications"],
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

  const announcements = publications?.filter((p) => p.type === "announcement") || [];
  const services = publications?.filter((p) => p.type === "service") || [];
  const articles = publications?.filter((p) => p.type === "article") || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Bonjour, {user?.firstName} !
              </h1>
              <p className="mt-2 text-muted-foreground">
                Découvrez les meilleurs services et entreprises près de chez vous
              </p>
            </div>

            <form onSubmit={handleSearch} className="mt-6 flex gap-3 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Que recherchez-vous ?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-full"
                  data-testid="input-search-home"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-12 px-6 rounded-full"
                data-testid="button-search-home"
              >
                <Search className="h-5 w-5 mr-2" />
                Rechercher
              </Button>
            </form>
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Catégories</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/search">
                  Voir tout
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {loadingCategories ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <Skeleton className="h-4 w-16" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : categories && categories.length > 0 ? (
              <CategoryGrid categories={categories.slice(0, 6)} />
            ) : null}
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between gap-4 mb-6">
                <TabsList>
                  <TabsTrigger value="all" data-testid="tab-all">
                    Tout
                    {publications && (
                      <Badge variant="secondary" className="ml-2">
                        {publications.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="announcements" data-testid="tab-announcements">
                    Annonces
                    <Badge variant="secondary" className="ml-2">
                      {announcements.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="services" data-testid="tab-services">
                    Services
                    <Badge variant="secondary" className="ml-2">
                      {services.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="articles" data-testid="tab-articles">
                    Articles
                    <Badge variant="secondary" className="ml-2">
                      {articles.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <Button variant="outline" size="sm" asChild>
                  <Link href="/search">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Link>
                </Button>
              </div>

              {loadingPublications ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
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
              ) : (
                <>
                  <TabsContent value="all" className="mt-0">
                    {publications && publications.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {publications.map((publication) => (
                          <PublicationCard
                            key={publication.id}
                            publication={publication}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-12 text-center">
                        <p className="text-muted-foreground">
                          Aucune publication disponible.
                        </p>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="announcements" className="mt-0">
                    {announcements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {announcements.map((publication) => (
                          <PublicationCard
                            key={publication.id}
                            publication={publication}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-12 text-center">
                        <p className="text-muted-foreground">
                          Aucune annonce disponible.
                        </p>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="services" className="mt-0">
                    {services.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((publication) => (
                          <PublicationCard
                            key={publication.id}
                            publication={publication}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-12 text-center">
                        <p className="text-muted-foreground">
                          Aucun service disponible.
                        </p>
                      </Card>
                    )}
                  </TabsContent>

                  <TabsContent value="articles" className="mt-0">
                    {articles.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {articles.map((publication) => (
                          <PublicationCard
                            key={publication.id}
                            publication={publication}
                          />
                        ))}
                      </div>
                    ) : (
                      <Card className="p-12 text-center">
                        <p className="text-muted-foreground">
                          Aucun article disponible.
                        </p>
                      </Card>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
