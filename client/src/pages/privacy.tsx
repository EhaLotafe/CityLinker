import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-sm prose prose-blue max-w-none">
          <h1>Politique de Confidentialité</h1>
          <p className="text-sm text-gray-500">Dernière mise à jour : Décembre 2025</p>

          <h3>1. Collecte des données</h3>
          <p>Nous collectons les informations que vous nous fournissez : Nom, Email, Numéro de téléphone. Pour les entreprises, nous collectons également l'adresse et les informations professionnelles.</p>

          <h3>2. Utilisation des données</h3>
          <p>Vos données servent uniquement à :</p>
          <ul>
            <li>Vous permettre de vous connecter et gérer votre compte.</li>
            <li>Mettre en relation clients et entreprises.</li>
            <li>Améliorer nos services.</li>
          </ul>
          <p>Nous ne vendons pas vos données personnelles à des tiers.</p>

          <h3>3. Sécurité</h3>
          <p>Nous utilisons des protocoles de sécurité standards (chiffrement des mots de passe) pour protéger vos informations.</p>

          <h3>4. Vos droits</h3>
          <p>Conformément à la législation en vigueur en RDC, vous pouvez demander la modification ou la suppression de votre compte en nous contactant à support@citylinker.cd.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}