import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: () => React.JSX.Element;
  allowedRoles?: ("client" | "business" | "admin")[];
};

export function ProtectedRoute({
  path,
  component: Component,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        // 1. Chargement
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          );
        }

        // 2. Pas connecté -> Login
        if (!user) {
          return <Redirect to="/login" />;
        }

        // 3. Mauvais Rôle -> Redirection
        if (allowedRoles && !allowedRoles.includes(user.role as any)) {
            // Si un business essaie d'aller sur /admin -> dashboard
            if (user.role === "business") return <Redirect to="/dashboard" />;
            // Si un client essaie d'aller sur /admin -> home
            return <Redirect to="/home" />;
        }

        // 4. Accès autorisé
        return <Component />;
      }}
    </Route>
  );
}