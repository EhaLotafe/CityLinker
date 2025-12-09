//client/src/components/publication-card.tsx
import { MapPin, Eye, Clock } from "lucide-react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./star-rating";
import type { PublicationWithDetails } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PublicationCardProps {
  publication: PublicationWithDetails;
  className?: string;
}

export function PublicationCard({ publication, className }: PublicationCardProps) {
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

  const averageRating = publication.averageRating || 0;
  const reviewCount = publication.reviewCount || 0;

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <Link href={`/publication/${publication.id}`}>
      <Card
        className={cn(
          "overflow-visible cursor-pointer transition-all duration-200 hover:-translate-y-1",
          "hover:shadow-lg",
          className
        )}
        data-testid={`card-publication-${publication.id}`}
      >
        <div className="relative aspect-video overflow-hidden rounded-t-md">
          {publication.image ? (
            <img
              src={publication.image}
              alt={publication.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary/30">
                {publication.title.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <Badge
            className={cn(
              "absolute top-3 left-3 text-xs font-medium",
              typeColors[publication.type]
            )}
          >
            {typeLabels[publication.type]}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-base line-clamp-1 text-foreground">
              {publication.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {publication.description}
            </p>
            <div className="flex items-center justify-between pt-2">
              <StarRating
                rating={averageRating}
                size="sm"
                showValue
                reviewCount={reviewCount}
              />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
              {publication.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {publication.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {publication.views}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(publication.createdAt)}
              </span>
            </div>
            {publication.user && (
              <div className="flex items-center gap-2 pt-2 border-t border-border mt-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {publication.user.firstName?.charAt(0)}
                  {publication.user.lastName?.charAt(0)}
                </div>
                <span className="text-xs text-muted-foreground">
                  {publication.user.businessName ||
                    `${publication.user.firstName} ${publication.user.lastName}`}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
