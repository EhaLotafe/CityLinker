import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-lubumbashi-blue mb-8 text-center">Foire Aux Questions</h1>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>L'inscription est‑elle réellement gratuite&nbsp;?</AccordionTrigger>
              <AccordionContent>
                Oui. L'inscription des utilisateurs est entièrement gratuite. Les entreprises peuvent
                également créer un profil sans frais. Des fonctionnalités premium — élaborées par Myrage
                pour soutenir la visibilité locale — arriveront progressivement.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Comment obtenir le badge "Vérifié"&nbsp;?</AccordionTrigger>
              <AccordionContent>
                Le processus repose sur une validation manuelle (adresse, contact, présence réelle). Cette
                politique, mise en place par Myrage, garantit un écosystème fiable et conforme aux attentes
                du marché lushois. Pour accélérer la vérification, contactez notre support.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Puis‑je contester ou supprimer un avis&nbsp;?</AccordionTrigger>
              <AccordionContent>
                La transparence est au cœur de CityLinker. Les avis ne sont pas supprimés, sauf en cas de
                propos diffamatoires, insultants ou manifestement faux. Vous disposez d’un droit de réponse
                pour clarifier votre position.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Quels services peuvent être publiés&nbsp;?</AccordionTrigger>
              <AccordionContent>
                Tous les services légaux en RDC sont acceptés : restauration, BTP, santé, beauté, transport,
                technologie, services à domicile, événementiel, artisanat et plus. L’objectif — défini par
                Myrage — est d’ouvrir une vitrine numérique inclusive et représentative du marché local.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Qui se trouve derrière CityLinker&nbsp;?</AccordionTrigger>
              <AccordionContent>
                CityLinker est un projet conçu par Eha Lotafe, ingénieur logiciel, créateur de solutions digitalisées
                et acteur engagé dans la modernisation technologique du Katanga. Son approche combine pragmatisme,
                IA appliquée, accessibilité et sens du terrain.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Pourquoi CityLinker a‑t‑il été créé&nbsp;?</AccordionTrigger>
              <AccordionContent>
                Le projet répond à un besoin concret : faciliter la découverte de prestataires fiables à
                Lubumbashi, structurer l’offre locale et professionnaliser la visibilité des acteurs économiques.
                L’objectif est de digitaliser la confiance, de fluidifier l’accès aux services et de renforcer
                l’économie urbaine.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Footer />
    </div>
  );
}
