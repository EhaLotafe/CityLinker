import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch, useLocation } from "wouter";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { PublicationCard } from "@/components/publication-card";
import type { PublicationWithDetails, Category } from "@shared/schema";

export default function SearchPage() {
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(searchString);
  
  const [query, setQuery] = useState(params.get("q") || "");
  const [selectedType, setSelectedType] = useState(params.get("type") || "all");
  const [selectedCategory, setSelectedCategory] = useState(params.get("category") || "all");
  const [sortBy, setSortBy] = useState("recent");

  const { data: publications, isLoading: loadingPublications } = useQuery<
    PublicationWithDetails[]
  >({
    queryKey: ["/api/publications/search", query, selectedType, selectedCategory],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (query) newParams.set("q", query);
    if (selectedType !== "all") newParams.set("type", selectedType);
    if (selectedCategory !== "all") newParams.set("category", selectedCategory);
    const newSearch = newParams.toString();
    if (newSearch !== searchString) {
      setLocation(`/search${newSearch ? `?${newSearch}` : ""}`, { replace: true });
    }
  }, [query, selectedType, selectedCategory, searchString, setLocation]);

  const filteredPublications = publications
    ?.filter((p) => {
      if (selectedType !== "all" && p.type !== selectedType) return false;
      if (selectedCategory !== "all" && p.categoryId?.toString() !== selectedCategory)
        return false;
      if (query) {
        const searchLower = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "views":
          return b.views - a.views;
        case "recent":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const hasFilters = selectedType !== "all" || selectedCategory !== "all" || query;

  const clearFilters = () => {
    setQuery("");
    setSelectedType("all");
    setSelectedCategory("all");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <section className="bg-muted/30 py-6 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1 max-w-xl w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des services, entreprises..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 h-12 rounded-full"
                  data-testid="input-search"
                />
              </div>

              <div className="grid grid-cols-2 md:flex items-center gap-3 w-full md:w-auto">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-40" data-testid="select-type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="announcement">Annonces</SelectItem>
                    <SelectItem value="service">Services</SelectItem>
                    <SelectItem value="article">Articles</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-44" data-testid="select-category">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes catégories</SelectItem>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="col-span-2 md:col-span-1">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-36" data-testid="select-sort">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Plus récent</SelectItem>
                      <SelectItem value="rating">Mieux noté</SelectItem>
                      <SelectItem value="views">Plus vu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                {query && (
                  <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                    Recherche: {query}
                    <button 
                      onClick={() => setQuery("")}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                      aria-label="Effacer le terme de recherche"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedType !== "all" && (
                  <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                    Type: {selectedType === "announcement" ? "Annonces" : selectedType === "service" ? "Services" : "Articles"}
                    <button 
                      onClick={() => setSelectedType("all")}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                      aria-label="Effacer le filtre type"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory !== "all" && (
                  <Badge variant="secondary" className="gap-1 pl-2 pr-1">
                    Catégorie: {categories?.find((c) => c.id.toString() === selectedCategory)?.name}
                    <button 
                      onClick={() => setSelectedCategory("all")}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors"
                      aria-label="Effacer le filtre catégorie"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7">
                  Effacer tout
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                {loadingPublications
                  ? "Recherche en cours..."
                  : `${filteredPublications?.length || 0} résultat${
                      (filteredPublications?.length || 0) > 1 ? "s" : ""
                    }`}
              </p>
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
            ) : filteredPublications && filteredPublications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPublications.map((publication) => (
                  <PublicationCard key={publication.id} publication={publication} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-muted/20 border-dashed">
                <div className="max-w-md mx-auto">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
                  <p className="text-muted-foreground mb-4">
                    Nous n'avons trouvé aucune publication correspondant à vos critères.
                    Essayez de modifier vos filtres.
                  </p>
                  {hasFilters && (
                    <Button variant="outline" onClick={clearFilters}>
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              </Card>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}