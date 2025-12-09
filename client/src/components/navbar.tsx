//client/src/components/navbar.tsx
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Search, User, LogOut, LayoutDashboard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface NavbarProps {
  transparent?: boolean;
}

export function Navbar({ transparent = false }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isLoading } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin";
    if (user.role === "business") return "/business";
    return "/home";
  };

  const getInitials = () => {
    if (!user) return "?";
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-md border-b border-border"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex-shrink-0">
            <span
              className={cn(
                "text-xl font-bold tracking-tight",
                transparent ? "text-white" : "text-foreground"
              )}
              data-testid="link-logo"
            >
              City<span className="text-primary">Linker</span>
            </span>
          </Link>

          {!transparent && user && (
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-lg mx-8"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des services, entreprises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 rounded-full bg-muted/50 border-0 focus-visible:ring-1"
                  data-testid="input-search"
                />
              </div>
            </form>
          )}

          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                    data-testid="button-user-menu"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={getDashboardLink()}
                      className="flex items-center gap-2 cursor-pointer"
                      data-testid="link-dashboard"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                      data-testid="link-profile"
                    >
                      <User className="h-4 w-4" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive cursor-pointer"
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild data-testid="link-login">
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild data-testid="link-register">
                  <Link href="/register">Inscription</Link>
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className={cn("h-5 w-5", transparent && "text-white")} />
            ) : (
              <Menu className={cn("h-5 w-5", transparent && "text-white")} />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-4">
            {user && (
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 rounded-full"
                    data-testid="input-search-mobile"
                  />
                </div>
              </form>
            )}
            <div className="flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Tableau de bord
                    </Button>
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Mon profil
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Inscription</Button>
                  </Link>
                </>
              )}
              <div className="flex justify-center pt-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
