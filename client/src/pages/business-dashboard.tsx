//client/src/pages/business-dashboard.tsx
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  LayoutDashboard,
  FileText,
  Plus,
  Eye,
  Star,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { PublicationForm } from "@/components/publication-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Publication, PublicationWithDetails } from "@shared/schema";

export default function BusinessDashboardPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: myPublications, isLoading: loadingPublications } = useQuery<
    PublicationWithDetails[]
  >({
    queryKey: ["/api/business/publications"],
  });

  const { data: stats } = useQuery<{
    totalViews: number;
    totalReviews: number;
    averageRating: number;
    pendingCount: number;
    approvedCount: number;
  }>({
    queryKey: ["/api/business/stats"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/publications/${id}`);
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/business/publications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/business/stats"] });
      toast({ title: "Publication supprimée" });
      setDeletingId(null);
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la publication",
        variant: "destructive",
      });
    },
  });

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

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  const pendingPublications = myPublications?.filter((p) => p.status === "pending") || [];
  const approvedPublications = myPublications?.filter((p) => p.status === "approved") || [];
  const rejectedPublications = myPublications?.filter((p) => p.status === "rejected") || [];

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
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive data-testid="link-dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Tableau de bord</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/home" data-testid="link-explore">
                        <Eye className="h-4 w-4" />
                        <span>Explorer</span>
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
                <h1 className="text-lg font-semibold">Tableau de bord</h1>
                <p className="text-sm text-muted-foreground">
                  {user?.businessName || `${user?.firstName} ${user?.lastName}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-new-publication">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle publication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Créer une publication</DialogTitle>
                    <DialogDescription>
                      Votre publication sera soumise à validation avant d'être publiée.
                    </DialogDescription>
                  </DialogHeader>
                  <PublicationForm
                    onSuccess={() => {
                      setIsCreateDialogOpen(false);
                      queryClient.invalidateQueries({ queryKey: ["/api/business/publications"] });
                      queryClient.invalidateQueries({ queryKey: ["/api/business/stats"] });
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.totalViews || 0}</p>
                        <p className="text-sm text-muted-foreground">Vues totales</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                        <Star className="h-6 w-6 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {stats?.averageRating?.toFixed(1) || "0.0"}
                        </p>
                        <p className="text-sm text-muted-foreground">Note moyenne</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats?.totalReviews || 0}</p>
                        <p className="text-sm text-muted-foreground">Avis reçus</p>
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
                        <p className="text-2xl font-bold">{stats?.approvedCount || 0}</p>
                        <p className="text-sm text-muted-foreground">Publications actives</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Mes publications</CardTitle>
                  <CardDescription>
                    Gérez vos annonces, services et articles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">
                        Tout ({myPublications?.length || 0})
                      </TabsTrigger>
                      <TabsTrigger value="pending">
                        En attente ({pendingPublications.length})
                      </TabsTrigger>
                      <TabsTrigger value="approved">
                        Approuvés ({approvedPublications.length})
                      </TabsTrigger>
                      <TabsTrigger value="rejected">
                        Rejetés ({rejectedPublications.length})
                      </TabsTrigger>
                    </TabsList>

                    {loadingPublications ? (
                      <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 p-4 rounded-lg border"
                          >
                            <Skeleton className="w-20 h-14 rounded" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-6 w-20" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <TabsContent value="all" className="mt-0">
                          <PublicationList
                            publications={myPublications || []}
                            getStatusBadge={getStatusBadge}
                            onEdit={setEditingPublication}
                            onDelete={setDeletingId}
                          />
                        </TabsContent>
                        <TabsContent value="pending" className="mt-0">
                          <PublicationList
                            publications={pendingPublications}
                            getStatusBadge={getStatusBadge}
                            onEdit={setEditingPublication}
                            onDelete={setDeletingId}
                          />
                        </TabsContent>
                        <TabsContent value="approved" className="mt-0">
                          <PublicationList
                            publications={approvedPublications}
                            getStatusBadge={getStatusBadge}
                            onEdit={setEditingPublication}
                            onDelete={setDeletingId}
                          />
                        </TabsContent>
                        <TabsContent value="rejected" className="mt-0">
                          <PublicationList
                            publications={rejectedPublications}
                            getStatusBadge={getStatusBadge}
                            onEdit={setEditingPublication}
                            onDelete={setDeletingId}
                          />
                        </TabsContent>
                      </>
                    )}
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>

      <Dialog
        open={!!editingPublication}
        onOpenChange={(open) => !open && setEditingPublication(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la publication</DialogTitle>
          </DialogHeader>
          {editingPublication && (
            <PublicationForm
              publication={editingPublication}
              onSuccess={() => {
                setEditingPublication(null);
                queryClient.invalidateQueries({ queryKey: ["/api/business/publications"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La publication sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}

function PublicationList({
  publications,
  getStatusBadge,
  onEdit,
  onDelete,
}: {
  publications: PublicationWithDetails[];
  getStatusBadge: (status: string) => React.ReactNode;
  onEdit: (publication: Publication) => void;
  onDelete: (id: number) => void;
}) {
  if (publications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Aucune publication dans cette catégorie
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {publications.map((publication) => (
        <div
          key={publication.id}
          className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          data-testid={`publication-item-${publication.id}`}
        >
          <div className="w-20 h-14 rounded bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
            {publication.image ? (
              <img
                src={publication.image}
                alt={publication.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{publication.title}</h4>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
              <span className="capitalize">
                {publication.type === "announcement"
                  ? "Annonce"
                  : publication.type === "service"
                  ? "Service"
                  : "Article"}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {publication.views}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {publication.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
          </div>
          {getStatusBadge(publication.status)}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/publication/${publication.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Voir
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(publication)}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(publication.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
