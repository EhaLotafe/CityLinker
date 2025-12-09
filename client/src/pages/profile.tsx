import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { ArrowLeft, Loader2, User, Building2, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessWebsite: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
      businessName: user?.businessName || "",
      businessDescription: user?.businessDescription || "",
      businessAddress: user?.businessAddress || "",
      businessPhone: user?.businessPhone || "",
      businessWebsite: user?.businessWebsite || "",
    },
  });

  async function onSubmit(data: ProfileFormData) {
    setIsLoading(true);
    try {
      const response = await apiRequest("PATCH", "/api/auth/profile", data);
      const result = await response.json();

      if (response.ok) {
        setUser(result.user);
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été enregistrées.",
        });
      } else {
        toast({
          title: "Erreur",
          description: result.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!user) return null;

  const getInitials = () => {
    return `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`;
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case "admin":
        return <Badge className="bg-purple-500/10 text-purple-600">Administrateur</Badge>;
      case "business":
        return <Badge className="bg-blue-500/10 text-blue-600"><Building2 className="h-3 w-3 mr-1" />Entreprise</Badge>;
      default:
        return <Badge className="bg-emerald-500/10 text-emerald-600"><User className="h-3 w-3 mr-1" />Client</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link href={user.role === "admin" ? "/admin" : user.role === "business" ? "/business" : "/home"}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Retour
            </Link>
          </Button>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold">{user.firstName} {user.lastName}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" /> {user.email}
                    </p>
                    <div className="mt-2">{getRoleBadge()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Modifiez vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl><Input placeholder="Jean" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl><Input placeholder="Dupont" {...field} value={field.value || ""} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl><Input type="tel" placeholder="+243..." {...field} value={field.value || ""} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {user.role === "business" && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-4">Informations entreprise</h3>
                          <div className="space-y-4">
                            <FormField control={form.control} name="businessName" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom de l'entreprise</FormLabel>
                                <FormControl><Input placeholder="Ma Super Entreprise" {...field} value={field.value || ""} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />

                            <FormField control={form.control} name="businessDescription" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl><Textarea placeholder="Décrivez votre activité" className="resize-none" rows={3} {...field} value={field.value || ""} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField control={form.control} name="businessPhone" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Téléphone pro</FormLabel>
                                  <FormControl><Input type="tel" placeholder="+243..." {...field} value={field.value || ""} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />

                              <FormField control={form.control} name="businessWebsite" render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Site web</FormLabel>
                                  <FormControl><Input placeholder="https://..." {...field} value={field.value || ""} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )} />
                            </div>

                            <FormField control={form.control} name="businessAddress" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Adresse</FormLabel>
                                <FormControl><Input placeholder="Lubumbashi, ..." {...field} value={field.value || ""} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )} />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}