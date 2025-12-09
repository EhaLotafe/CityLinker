import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-sm prose prose-blue max-w-none">
          <h1>Conditions Générales d'Utilisation (CGU)</h1>
          <p>
            Les présentes Conditions Générales d’Utilisation encadrent l’accès et l’usage de CityLinker.
            En utilisant la plateforme, vous acceptez pleinement et sans réserve les dispositions ci-après.
          </p>

          <h3>1. Objet du service</h3>
          <p>
            CityLinker est une plateforme de mise en relation destinée à faciliter la découverte,
            l’évaluation et la localisation de services, d’établissements et d’activités urbaines.
            L’application ne remplace pas les services officiels de la Ville mais améliore l’accès
            à l’information et encourage la transparence locale.
          </p>

          <h3>2. Respect du cadre légal congolais</h3>
          <p>
            L’usage de CityLinker doit être conforme aux lois applicables en République Démocratique du Congo,
            notamment les dispositions relatives :
          </p>
          <ul>
            <li>à la lutte contre la fraude et la cybercriminalité ;</li>
            <li>à la protection des consommateurs ;</li>
            <li>à la diffusion publique d’informations ;</li>
            <li>aux télécommunications et données électroniques (Loi n°18/019) ;</li>
            <li>au respect de l’ordre public et des bonnes mœurs.</li>
          </ul>

          <h3>3. Responsabilité des utilisateurs</h3>
          <p>
            Chaque utilisateur demeure responsable des données qu’il publie, notamment les avis,
            commentaires, descriptions ou photos. Toute diffusion de contenu mensonger, offensant, haineux,
            diffamatoire, frauduleux ou contraire à la loi entraînera la suppression immédiate du contenu
            et peut mener à la suspension ou clôture définitive du compte.
          </p>

          <h3>4. Véracité des avis</h3>
          <p>
            Les avis publiés doivent refléter une expérience réelle et vérifiable. Les avis manipulés,
            rémunérés ou générés artificiellement sont strictement interdits. CityLinker se réserve le droit
            de demander une preuve d’expérience en cas de doute raisonnable.
          </p>

          <h3>5. Modération et retrait des contenus</h3>
          <p>
            CityLinker agit en qualité d’hébergeur. Conformément aux obligations légales,
            la plateforme peut retirer sans préavis tout contenu jugé illicite, dangereux,
            frauduleux, violent ou contraire à l’intérêt public. La modération est réalisée
            de manière impartiale, dans le respect de la dignité de chaque utilisateur.
          </p>

          <h3>6. Protection des données personnelles</h3>
          <p>
            CityLinker collecte uniquement les données strictement nécessaires au fonctionnement du service.
            Les données personnelles ne sont ni vendues, ni partagées avec des tiers non autorisés.
            L’utilisateur peut demander à tout moment la modification ou la suppression de son compte.
          </p>

          <h3>7. Propriété intellectuelle</h3>
          <p>
            Le nom “CityLinker”, le logo, l’identité visuelle, la structure de la plateforme,
            les éléments graphiques et algorithmiques sont protégés. Toute reproduction,
            modification ou exploitation non autorisée est formellement interdite.
          </p>

          <h3>8. Responsabilités de CityLinker</h3>
          <p>
            CityLinker met en œuvre des moyens techniques et organisationnels pour garantir un service stable.
            Toutefois, la plateforme ne peut être tenue responsable en cas :
          </p>
          <ul>
            <li>d’informations inexactes publiées par des tiers ;</li>
            <li>d’interruptions temporaires liées à la maintenance ;</li>
            <li>d’usage détourné du service par un utilisateur ;</li>
            <li>d’événements relevant d’un cas de force majeure.</li>
          </ul>

          <h3>9. Sécurité et fraude</h3>
          <p>
            Toute tentative de contournement, piratage, manipulation de données, création de faux comptes ou
            diffusion de contenus frauduleux sera sanctionnée. Les comportements menaçant la sécurité du service
            pourront être signalés aux autorités compétentes.
          </p>

          <h3>10. Modification des CGU</h3>
          <p>
            CityLinker se réserve le droit de mettre à jour les présentes CGU afin de rester aligné avec
            l’évolution du cadre légal congolais et des standards de sécurité numérique. Les modifications
            entreront en vigueur dès leur publication.
          </p>

          <h3>11. Contact</h3>
          <p>
            Pour toute demande, assistance ou signalement :  
            <strong>Email :</strong> support@citylinker.cd  
            <br />
            Une réponse vous sera fournie dans les plus brefs délais.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
