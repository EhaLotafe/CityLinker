//client/src/pages/admin-dashboard.tsx
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Building2,
  User,
  TrendingUp,
  MoreVertical,
  Check,
  X,
  Loader2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PublicationWithDetails, User as UserType } from "@shared/schema";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");

  const { data: stats } = useQuery<{
    totalUsers: number;
    totalBusinesses: number;
    totalClients: number;
    totalPublications: number;
    pendingPublications: number;
    totalReviews: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: pendingPublications, isLoading: loadingPending } = useQuery<
    PublicationWithDetails[]
  >({
    queryKey: ["/api/admin/publications/pending"],
  });

  const { data: allPublications, isLoading: loadingAll } = useQuery<
    PublicationWithDetails[]
  >({
    queryKey: ["/api/admin/publications"],
  });

  const { data: users, isLoading: loadingUsers } = useQuery<UserType[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: "approved" | "rejected";
    }) => {
      const response = await apiRequest("PATCH", `/api/admin/publications/${id}/status`, {
        status,
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/publications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/publications/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: variables.status === "approved" ? "Publication approuvée" : "Publication rejetée",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approuvé
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-500/10 text-red-600 dark:text-red-400">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        );
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "business":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Building2 className="h-3 w-3 mr-1" />
            Entreprise
          </Badge>
        );
      default:
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <User className="h-3 w-3 mr-1" />
            Client
          </Badge>
        );
    }
  };

  return (
    <SidebarProvider style={sidebarStyle as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link href="/">
              <span className="text-xl font-bold tracking-tight">
                City<span className="text-primary">Linker</span>
              </span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive data-testid="link-admin-dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Tableau de bord</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/home" data-testid="link-explore">
                        <Eye className="h-4 w-4" />
                        <span>Voir le site</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between gap-4 p-4 border-b border-border bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h1 className="text-lg font-semibold">Administration</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez la plateforme CityLinker
                </p>
              </div>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                        <p className="text-sm text-muted-foreground">Utilisateurs</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.totalBusinesses || 0}</p>
                        <p className="text-sm text-muted-foreground">Entreprises</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.totalPublications || 0}</p>
                        <p className="text-sm text-muted-foreground">Publications</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.pendingPublications || 0}</p>
                        <p className="text-sm text-muted-foreground">En attente</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Validation des publications</CardTitle>
                    <CardDescription>
                      Approuvez ou rejetez les publications en attente
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="pending">
                          En attente ({pendingPublications?.length || 0})
                        </TabsTrigger>
                        <TabsTrigger value="all">Toutes</TabsTrigger>
                      </TabsList>

                      <TabsContent value="pending" className="mt-0">
                        {loadingPending ? (
                          <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                                <Skeleton className="w-16 h-12 rounded" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-1/3" />
                                  <Skeleton className="h-3 w-1/2" />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : pendingPublications && pendingPublications.length > 0 ? (
                          <div className="space-y-3">
                            {pendingPublications.map((publication) => (
                              <div
                                key={publication.id}
                                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                                data-testid={`pending-publication-${publication.id}`}
                              >
                                <div className="w-16 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                                  {publication.image ? (
                                    <img
                                      src={publication.image}
                                      alt={publication.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{publication.title}</h4>
                                  <p className="text-sm text-muted-foreground truncate">
                                    Par {publication.user?.businessName || `${publication.user?.firstName} ${publication.user?.lastName}`}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    onClick={() =>
                                      updateStatusMutation.mutate({
                                        id: publication.id,
                                        status: "approved",
                                      })
                                    }
                                    disabled={updateStatusMutation.isPending}
                                    data-testid={`button-approve-${publication.id}`}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      updateStatusMutation.mutate({
                                        id: publication.id,
                                        status: "rejected",
                                      })
                                    }
                                    disabled={updateStatusMutation.isPending}
                                    data-testid={`button-reject-${publication.id}`}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            Aucune publication en attente de validation
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="all" className="mt-0">
                        {loadingAll ? (
                          <div className="space-y-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                                <Skeleton className="w-16 h-12 rounded" />
                                <div className="flex-1 space-y-2">
                                  <Skeleton className="h-4 w-1/3" />
                                  <Skeleton className="h-3 w-1/2" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                              </div>
                            ))}
                          </div>
                        ) : allPublications && allPublications.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {allPublications.map((publication) => (
                              <div
                                key={publication.id}
                                className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                              >
                                <div className="w-16 h-12 rounded bg-muted flex items-center justify-center overflow-hidden">
                                  {publication.image ? (
                                    <img
                                      src={publication.image}
                                      alt={publication.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium truncate">{publication.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {publication.user?.businessName ||
                                      `${publication.user?.firstName} ${publication.user?.lastName}`}
                                  </p>
                                </div>
                                {getStatusBadge(publication.status)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            Aucune publication
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Utilisateurs récents</CardTitle>
                    <CardDescription>Derniers inscrits sur la plateforme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loadingUsers ? (
                      <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="flex-1 space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-32" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : users && users.length > 0 ? (
                      <div className="space-y-3">
                        {users.slice(0, 8).map((u) => (
                          <div key={u.id} className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {u.firstName?.charAt(0)}
                                {u.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {u.firstName} {u.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {u.email}
                              </p>
                            </div>
                            {getRoleBadge(u.role)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Aucun utilisateur
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
