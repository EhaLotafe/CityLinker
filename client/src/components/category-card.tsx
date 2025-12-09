//client/src/components/category-card.tsx
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Utensils,
  Stethoscope,
  GraduationCap,
  Car,
  Hammer,
  Shirt,
  Sparkles,
  Home,
  Briefcase,
  Plane,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";

const iconMap: Record<string, typeof Building2> = {
  building: Building2,
  utensils: Utensils,
  stethoscope: Stethoscope,
  graduation: GraduationCap,
  car: Car,
  hammer: Hammer,
  shirt: Shirt,
  sparkles: Sparkles,
  home: Home,
  briefcase: Briefcase,
  plane: Plane,
  shopping: ShoppingBag,
};

interface CategoryCardProps {
  category: Category;
  count?: number;
  className?: string;
}

export function CategoryCard({ category, count, className }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Building2;

  return (
    <Link href={`/search?category=${category.id}`}>
      <Card
        className={cn(
          "overflow-visible cursor-pointer transition-all duration-200",
          "hover:-translate-y-1 hover:shadow-md group",
          className
        )}
        data-testid={`card-category-${category.id}`}
      >
        <CardContent className="p-6 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Icon className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{category.name}</h3>
            {count !== undefined && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {count} {count === 1 ? "annonce" : "annonces"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function CategoryGrid({ categories }: { categories: (Category & { count?: number })[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          count={category.count}
        />
      ))}
    </div>
  );
}
