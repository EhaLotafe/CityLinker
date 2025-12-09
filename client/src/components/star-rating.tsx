//client/src/components/star-rating.tsx
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  reviewCount?: number;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  showValue = false,
  reviewCount,
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < maxRating; i++) {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating && rating - i >= 0.5;

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          disabled={!interactive}
          className={cn(
            "focus:outline-none transition-transform",
            interactive && "cursor-pointer hover:scale-110",
            !interactive && "cursor-default"
          )}
          data-testid={`star-${i + 1}`}
        >
          {half ? (
            <StarHalf
              className={cn(
                sizeClasses[size],
                "text-amber-400 fill-amber-400"
              )}
            />
          ) : (
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30"
              )}
            />
          )}
        </button>
      );
    }
    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center gap-0.5">{renderStars()}</div>
      {showValue && (
        <span className={cn("font-medium text-foreground", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount !== undefined && (
        <span className={cn("text-muted-foreground", textSizeClasses[size])}>
          ({reviewCount} avis)
        </span>
      )}
    </div>
  );
}
