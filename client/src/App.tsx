// client/src/App.tsx
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";

// Pages principales
import LandingPage from "@/pages/landing";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ClientHomePage from "@/pages/client-home";
import BusinessDashboardPage from "@/pages/business-dashboard";
import AdminDashboardPage from "@/pages/admin-dashboard";
import SearchPage from "@/pages/search";
import PublicationDetailPage from "@/pages/publication-detail";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";

// Pages statiques (Informations)
import AboutPage from "@/pages/about";
import FAQPage from "@/pages/faq";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";

function Router() {
  return (
    <Switch>
      {/* Routes Principales */}
      <Route path="/" component={LandingPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      
      {/* Espaces Connectés */}
      <Route path="/home" component={ClientHomePage} />
      <Route path="/business" component={BusinessDashboardPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/profile" component={ProfilePage} />
      
      {/* Découverte */}
      <Route path="/search" component={SearchPage} />
      <Route path="/publication/:id" component={PublicationDetailPage} />

      {/* Pages d'information (Footer) */}
      <Route path="/about" component={AboutPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />

      {/* Fallback 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;