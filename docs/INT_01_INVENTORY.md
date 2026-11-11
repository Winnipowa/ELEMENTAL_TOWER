# INT-01 — inventaire fonctionnel exact

Référence `0.4.0-int.1` issue de PR #15. « Fonctionnel » signifie exécuté localement dans le shell ; cela ne rend pas le contenu fictif réel. Tout le catalogue actuel est de démonstration.

| Domaine | Réellement fonctionnel dans le prototype | Simulé / illustratif | Absent |
|---|---|---|---|
| Shell / Monde | Routes hash, cinq onglets, retours parent, repli route inconnue, défilement central et navigation séparée | Carte et disponibilité de régions du catalogue démo | Carte/campagne canonique, streaming de monde |
| Collection | Recherche/filtres, statut disponible/verrouillé, fiches des trois gardiens, panneaux de détails, images de référence | IDs `demo-*`, familles/classes/conditions/compétences et synergie du catalogue démo | Roster complet validé, statistiques moteur, modification de règles |
| Codex | Présentation illustrée et navigation vers fiches ; 3 familles, 2 classes, 1 synergie | Effets et descriptions fictifs, association des FX proposée | Calcul de synergies de combat, catalogue canonique |
| Expédition | Sélection de l’équipe/région autorisées en démo, validation, transitions Monde → Préparation → session → Résultats → Monde, gestion d’erreurs et abandon | MockGameBridge, victoire/défaite et résumé fixe, récompenses affichées sans attribution | Combat, moteur canonique, montage moteur, vérification de résultat réel |
| Profil / progression | Lecture et sauvegarde locale explicite dédiée, objectifs/chapitres du catalogue, gestion versions/conflits ; actions manuelles QA séparées | Collection initiale et objectifs démo ; déblocages QA enregistrables seulement dans le namespace démo | Compte, serveur, classement, synchronisation active ou migration V0.9 |
| Missions | Catalogue 6 missions / quotidien-hebdo-permanent, objectifs/conditions/récompenses, filtres et états | Compteurs et marqueurs QA uniquement en mémoire ; aucune réaction automatique à une victoire mock | Calendrier serveur, événements vérifiés, attribution de récompenses |
| Boutique | Catalogue versionné 5 produits/5 catégories, filtres, fiches/prévisualisation, disponibilité, chargement/erreur | Illustrations de référence servant d’emplacements proposés | Paiement, panier, achat, monnaie dépensée, attribution, inventaire cosmétique réel |
| Pass | Deux voies, 3 paliers cosmétiques, navigation et états lisibles | Progression et marqueurs obtenu/disponible QA en mémoire | Droit premium, abonnement, achat, expiration, récompense réelle |
| Paramètres | Quatre préférences d’affichage/accessibilité, stockage dédié versionné ; réduction des animations, informations version/prototype | Information de confidentialité préparatoire | Pilotage audio moteur, analytics/consentement de production, compte |
| Défis | Écran accessible et retour cohérent | Présentation d’attente prototype | Système de défis, matchmaking/PvP, classement |
| QA / Démonstration | Section dédiée, simulations contrôlées, états sans données/erreur, outils de test | Résultats, progression produits et contenu d’essai signalés | Autorité de production ou import automatique vers un compte réel |

## Données et stockage

- Catalogue cœur : `meta/data/catalog.demo.json`, schéma 1, 3 gardiens Luma/Mousse/Nyx, 4 régions, 2 chapitres, 2 objectifs. `meta/catalog.js` vérifie les références et versions.
- Catalogues produits : `meta/products/{missions,cosmetics,pass}.demo.json`, schéma 1, validation dédiée dans `service.js` ; interfaces locales remplaçables, aucun client serveur actif.
- Progression : `elemental-tower.meta-demo.v2`, schéma 2, source `demonstration`. Le format 1 est interprété en mémoire ; écriture explicite seulement. Donnée corrompue ou future protégée, IDs retirés archivés, conflits d’écriture détectés. Aucun résultat mock ne débloque un gardien ou un objectif.
- Préférences : `elemental-tower.meta-preferences.v1`, schéma 1, indépendantes de la progression. Les réglages ne prétendent pas piloter un moteur audio absent.
- Missions/Pass : état `ProductDemoState` en mémoire, perdu au rechargement, aucune transaction. L’interface de futurs événements vérifiés reste descriptive.
- Aucun accès du shell aux sauvegardes des prototypes V0.9, aucune réécriture ou suppression pendant INT-01.

## Assets, routes et dépendances

Six planches RGBA d’origine, environ 17 Mo, sont conservées avec empreintes de provenance. Les mappings d’art sont indépendants du catalogue/sauvegarde et sont maintenus sans changement. Les trois SVG historiques ne sont pas les portraits centraux actuels. Les autres personnages figurant sur les planches ne sont pas ajoutés arbitrairement au roster.

L’audit navigateur visite 24 routes : les écrans principaux, trois fiches gardien, cinq produits, deux fiches manquantes, les sous-écrans et les replis sans session/route inconnue. Les routes de résultat actif sont en plus parcourues par les suites d’expédition. Aucun moteur n’est nécessaire pour rendre ces écrans.

Le shell utilise HTML/CSS et modules JS natifs, sans dépendance npm de production. Playwright 1.65.0 sert seulement aux tests. Le serveur Node dans `tests/` est un outil de développement local ; aucune infrastructure de production, service worker ou enveloppe native n’est fournie.
