//client/src/components/publication-form.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Publication, Category } from "@shared/schema";

const publicationFormSchema = z.object({
  type: z.enum(["announcement", "service", "article"]),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  price: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

type PublicationFormData = z.infer<typeof publicationFormSchema>;

interface PublicationFormProps {
  publication?: Publication;
  onSuccess: () => void;
}

export function PublicationForm({ publication, onSuccess }: PublicationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<PublicationFormData>({
    resolver: zodResolver(publicationFormSchema),
    defaultValues: {
      type: publication?.type || "announcement",
      title: publication?.title || "",
      description: publication?.description || "",
      content: publication?.content || "",
      categoryId: publication?.categoryId?.toString() || "",
      price: publication?.price || "",
      location: publication?.location || "",
      image: publication?.image || "",
    },
  });

  const selectedType = form.watch("type");

  async function onSubmit(data: PublicationFormData) {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        // Remplacer la ligne de conversion par :
        categoryId: data.categoryId && !isNaN(parseInt(data.categoryId)) 
        ? parseInt(data.categoryId) 
        : null,
      };

      const response = publication
        ? await apiRequest("PATCH", `/api/publications/${publication.id}`, payload)
        : await apiRequest("POST", "/api/publications", payload);

      if (response.ok) {
        toast({
          title: publication ? "Publication modifiée" : "Publication créée",
          description: publication
            ? "Vos modifications ont été enregistrées."
            : "Votre publication a été soumise pour validation.",
        });
        onSuccess();
      } else {
        const result = await response.json();
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type de publication</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-type">
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="announcement">Annonce</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input
                  placeholder="Titre de votre publication"
                  data-testid="input-title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description courte</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Décrivez brièvement votre publication"
                  className="resize-none"
                  rows={3}
                  data-testid="input-description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType === "article" && (
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contenu de l'article</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Rédigez le contenu de votre article"
                    className="resize-none"
                    rows={8}
                    data-testid="input-content"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {(selectedType === "service" || selectedType === "announcement") && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix (optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: 50 000 FCFA"
                      data-testid="input-price"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation (optionnel)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: Abidjan, Cocody"
                      data-testid="input-location"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de l'image (optionnel)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://exemple.com/image.jpg"
                  data-testid="input-image"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" disabled={isLoading} data-testid="button-submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {publication ? "Enregistrement..." : "Création..."}
              </>
            ) : publication ? (
              "Enregistrer les modifications"
            ) : (
              "Soumettre pour validation"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
