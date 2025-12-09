//client/src/pages/register.tsx
import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import { registerSchema, type RegisterInput } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const roleParam = searchParams.get("role");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"client" | "business">(
    roleParam === "business" ? "business" : "client"
  );
  const { setUser } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      role: selectedRole,
      businessName: "",
      businessDescription: "",
    },
  });

  useEffect(() => {
    form.setValue("role", selectedRole);
  }, [selectedRole, form]);

  async function onSubmit(data: RegisterInput) {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register", data);
      const result = await response.json();
      
      if (response.ok) {
        setUser(result.user);
        toast({
          title: "Compte créé avec succès",
          description: `Bienvenue sur CityLinker, ${result.user.firstName} !`,
        });
        
        if (result.user.role === "business") {
          setLocation("/business");
        } else {
          setLocation("/home");
        }
      } else {
        toast({
          title: "Erreur d'inscription",
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-background dark:to-background">
      <header className="p-4 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-bold tracking-tight">
            City<span className="text-primary">Linker</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
            <CardDescription>
              Rejoignez CityLinker et connectez-vous aux meilleurs services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Button
                type="button"
                variant={selectedRole === "client" ? "default" : "outline"}
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2",
                  selectedRole === "client" && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => setSelectedRole("client")}
                data-testid="button-role-client"
              >
                <User className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Client</div>
                  <div className="text-xs opacity-80">Je cherche des services</div>
                </div>
              </Button>
              <Button
                type="button"
                variant={selectedRole === "business" ? "default" : "outline"}
                className={cn(
                  "h-auto py-4 flex flex-col items-center gap-2",
                  selectedRole === "business" && "ring-2 ring-primary ring-offset-2"
                )}
                onClick={() => setSelectedRole("business")}
                data-testid="button-role-business"
              >
                <Building2 className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Entreprise</div>
                  <div className="text-xs opacity-80">Je propose des services</div>
                </div>
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Jean"
                            data-testid="input-firstname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Dupont"
                            data-testid="input-lastname"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="votre@email.com"
                          autoComplete="email"
                          data-testid="input-email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Téléphone (optionnel)</FormLabel>
                        <FormControl>
                          {/* CORRECTION ICI : value={field.value || ""} */}
                          <Input
                            type="tel"
                            placeholder="+243 00 00 00 00"
                            data-testid="input-phone"
                            {...field}
                            value={field.value || ""} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimum 6 caractères"
                            autoComplete="new-password"
                            data-testid="input-password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedRole === "business" && (
                  <>
                      <FormField
                          control={form.control}
                          name="businessName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom de l'entreprise</FormLabel>
                              <FormControl>
                                {/* CORRECTION ICI */}
                                <Input
                                  placeholder="Ma Super Entreprise"
                                  data-testid="input-business-name"
                                  {...field}
                                  value={field.value || ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                    <FormField
                            control={form.control}
                            name="businessDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description (optionnel)</FormLabel>
                                <FormControl>
                                  {/* CORRECTION ICI */}
                                  <Input
                                    placeholder="Décrivez votre activité en quelques mots"
                                    data-testid="input-business-description"
                                    {...field}
                                    value={field.value || ""}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  data-testid="button-register"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création du compte...
                    </>
                  ) : (
                    "Créer mon compte"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte ?</span>{" "}
              <Link
                href="/login"
                className="text-primary font-medium hover:underline"
                data-testid="link-login"
              >
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
