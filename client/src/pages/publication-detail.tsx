//client/src/pages/publication-detail.tsx
import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  MapPin,
  Eye,
  Clock,
  Star,
  Share2,
  Phone,
  Mail,
  Globe,
  Building2,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { StarRating } from "@/components/star-rating";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PublicationWithDetails, ReviewWithUser } from "@shared/schema";

const reviewFormSchema = z.object({
  rating: z.number().min(1, "Veuillez sélectionner une note").max(5),
  comment: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export default function PublicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);

  const { data: publication, isLoading } = useQuery<PublicationWithDetails>({
    queryKey: ["/api/publications", id],
  });

  const { data: reviews, isLoading: loadingReviews } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/publications", id, "reviews"],
  });

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await apiRequest("POST", `/api/publications/${id}/reviews`, data);
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to submit review");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/publications", id] });
      queryClient.invalidateQueries({ queryKey: ["/api/publications", id, "reviews"] });
      form.reset();
      setSelectedRating(0);
      toast({ title: "Avis soumis", description: "Merci pour votre retour !" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmitReview = (data: ReviewFormData) => {
    if (selectedRating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez sélectionner une note avant de soumettre",
        variant: "destructive",
      });
      return;
    }
    reviewMutation.mutate({ ...data, rating: selectedRating });
  };

  const typeLabels = {
    announcement: "Annonce",
    service: "Service",
    article: "Article",
  };

  const typeColors = {
    announcement: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    service: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    article: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div>
                <Skeleton className="h-64 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!publication) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <h2 className="text-xl font-semibold mb-2">Publication introuvable</h2>
            <p className="text-muted-foreground mb-4">
              Cette publication n'existe pas ou a été supprimée.
            </p>
            <Button asChild>
              <Link href="/home">Retour à l'accueil</Link>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating = publication.averageRating || 0;
  const reviewCount = publication.reviewCount || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                {publication.image ? (
                  <img
                    src={publication.image}
                    alt={publication.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-6xl font-bold text-primary/30">
                      {publication.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <Badge
                  className={`absolute top-4 left-4 ${typeColors[publication.type]}`}
                >
                  {typeLabels[publication.type]}
                </Badge>
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {publication.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <StarRating
                    rating={averageRating}
                    showValue
                    reviewCount={reviewCount}
                  />
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {publication.views} vues
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatDate(publication.createdAt)}
                  </span>
                  {publication.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {publication.location}
                    </span>
                  )}
                </div>

                <p className="text-foreground leading-relaxed mb-6">
                  {publication.description}
                </p>

                {publication.content && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {publication.content.split("\n").map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {publication.price && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <span className="text-sm text-muted-foreground">Prix</span>
                    <p className="text-2xl font-bold text-primary">
                      {publication.price}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-6">
                  Avis ({reviewCount})
                </h2>

                {user && user.role === "client" && (
                  <Card className="mb-6">
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-4">Laisser un avis</h3>
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmitReview)}
                          className="space-y-4"
                        >
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Votre note
                            </p>
                            <StarRating
                              rating={selectedRating}
                              size="lg"
                              interactive
                              onRatingChange={setSelectedRating}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Textarea
                                    placeholder="Partagez votre expérience (optionnel)"
                                    className="resize-none"
                                    rows={3}
                                    data-testid="input-review-comment"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={reviewMutation.isPending}
                            data-testid="button-submit-review"
                          >
                            {reviewMutation.isPending ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Envoi...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Envoyer l'avis
                              </>
                            )}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                )}

                {!user && (
                  <Card className="mb-6">
                    <CardContent className="py-6 text-center">
                      <p className="text-muted-foreground mb-4">
                        Connectez-vous pour laisser un avis
                      </p>
                      <Button asChild>
                        <Link href="/login">Se connecter</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {loadingReviews ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex gap-4">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="flex gap-4"
                        data-testid={`review-${review.id}`}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {review.user.firstName?.charAt(0)}
                            {review.user.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {review.user.firstName} {review.user.lastName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>
                          <StarRating rating={review.rating} size="sm" />
                          {review.comment && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun avis pour le moment. Soyez le premier à donner votre avis !
                  </p>
                )}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Publié par</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {publication.user.firstName?.charAt(0)}
                        {publication.user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {publication.user.businessName ||
                          `${publication.user.firstName} ${publication.user.lastName}`}
                      </p>
                      {publication.user.role === "business" && (
                        <Badge variant="secondary" className="text-xs">
                          <Building2 className="h-3 w-3 mr-1" />
                          Entreprise
                        </Badge>
                      )}
                    </div>
                  </div>

                  {publication.user.businessDescription && (
                    <p className="text-sm text-muted-foreground">
                      {publication.user.businessDescription}
                    </p>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    {publication.user.email && (
                      <a
                        href={`mailto:${publication.user.email}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {publication.user.email}
                      </a>
                    )}
                    {publication.user.businessPhone && (
                      <a
                        href={`tel:${publication.user.businessPhone}`}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {publication.user.businessPhone}
                      </a>
                    )}
                    {publication.user.businessWebsite && (
                      <a
                        href={publication.user.businessWebsite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Site web
                      </a>
                    )}
                    {publication.user.businessAddress && (
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {publication.user.businessAddress}
                      </span>
                    )}
                  </div>

                  <Button className="w-full" asChild>
                    <a href={`mailto:${publication.user.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Contacter
                    </a>
                  </Button>
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                        <a href={`https://wa.me/${publication.user.businessPhone?.replace(/\s/g, '')}`} target="_blank">
                          Discuter sur WhatsApp
                        </a>
                      </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
