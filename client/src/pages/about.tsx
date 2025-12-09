import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="bg-lubumbashi-blue text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-lubumbashi-yellow">À propos de CityLinker</h1>
            <p className="text-xl max-w-2xl mx-auto text-blue-100">
              La première plateforme numérique dédiée à la mise en relation des entreprises et des habitants du Katanga.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-lubumbashi-blue mb-6">Notre Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              CityLinker est né d'un constat simple : à Lubumbashi, il est souvent difficile de trouver rapidement un service fiable ou de faire connaître son entreprise sans passer par le bouche-à-oreille traditionnel.
              <br/><br/>
              Notre mission est de <strong>digitaliser la confiance</strong>. Nous permettons aux entreprises locales de rayonner et aux clients de trouver des prestataires vérifiés, notés et approuvés par la communauté.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-lubumbashi-blue" />
                </div>
                <h3 className="text-xl font-bold mb-2">Confiance</h3>
                <p className="text-gray-600">Chaque entreprise est vérifiée manuellement par nos équipes avant d'être publiée.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-lubumbashi-copper" />
                </div>
                <h3 className="text-xl font-bold mb-2">Simplicité</h3>
                <p className="text-gray-600">Une interface pensée pour les besoins locaux, rapide et accessible sur mobile.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-lubumbashi-green" />
                </div>
                <h3 className="text-xl font-bold mb-2">Communauté</h3>
                <p className="text-gray-600">Vos avis comptent. Ils aident les autres à faire les bons choix au quotidien.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}