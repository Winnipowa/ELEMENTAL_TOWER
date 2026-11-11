# META-01 — Rapport de développement

Statut : prototype web local de revue, sans fusion ni déploiement. Branche `feature/meta-app-shell-v1`.

## Lancer et vérifier

`npm ci`, puis `npm start` ; ouvrir http://127.0.0.1:4173/meta/index.html.
`npm test` vérifie l’adaptateur ; `npm run test:ui` lance un serveur temporaire et Edge headless (Edge installé requis). Les captures sont générées dans `test-results/`.

## Fonctionnalités réalisées

- Cinq destinations persistantes : Monde, Collection, Missions, Boutique, Profil.
- Carte SVG de quatre régions ; Aurore ouvre la préparation, régions verrouillées ou conceptuelles annoncées dans une modale.
- Collection illustrative : recherche, filtres famille/état, fiches de gardiens disponibles et verrouillés, fiche absente gérée.
- Sous-écrans : préparation, résultat absent, synergies, paramètres, Pass et défis ; liens contextuels et retour vers le parent. Historique navigateur par fragments, accès direct aux routes, route inconnue gérée.
- Missions et boutique présentent des concepts explicitement fictifs. Aucun achat, stock, minuterie, adversaire ou résultat réel inventé.
- Chargement asynchrone du catalogue, catalogue vide, recherche vide, erreur et reprise. Les paramètres proposent des outils de revue pour ces états.
- Navigation tactile, cibles principales ≥44px, focus visible, titres de page, focus sur le contenu après navigation, dialogue natif avec fermeture Escape et restitution du focus, safe areas et préférence de réduction des animations.

## Architecture et frontière moteur

`meta/app.js` : vues, routes et interactions. `meta/shell.css` : portrait jusqu’à 430px. `meta/bridge.js` : catalogue de fixtures versionné et adaptateur `MockGameBridge`.

Le remplacement de l’adaptateur est le futur point d’intégration : sa forme suit la proposition `GAME_BRIDGE_CONTRACT_V0.md`, à valider conjointement. Dans META-01, `startRun` et `openRun` refusent explicitement tout combat. L’abonnement retourne une fonction de désinscription sans émettre de résultat. Aucun moteur, constante de gameplay, sauvegarde V0.9, récompense ou progression n’est importé ou modifié. Aucun état de compte n’est persisté.

## Références examinées

- `META_APP_SCOPE_V1.md`, `GAME_BRIDGE_CONTRACT_V0.md`, GDD V1.1.
- PR #3 : carte isométrique, navigation et fiches ; documentation META_UI_V1_IMPLEMENTATION.
- PR #4 : hiérarchie violet/or, fantasy cute + dark, catalogue et écrans conceptuels ; documentation META_V10_PRODUCT_PROTOTYPE et styles de référence. Les prototypes moteurs ne sont pas fusionnés.
- Silhouettes SVG originales provisoires : aucun mapping du pack V0.14 vers un ID canonique supposé. Validation artistique requise.

## Résultats des tests

- Test Node de l’adaptateur réussi : catalogue cloné et isolé, lancement/ouverture refusés, désinscription disponible.
- Edge headless réel aux largeurs 320, 390 et 430, hauteur 844 : parcours de 14 routes par largeur, retours parents, historique navigateur préparation → monde, région verrouillée et fermeture Escape, modale combat indisponible, recherche vide/réinitialisation, catalogue vide, erreur et rechargement : réussis.
- Aucun débordement horizontal sur les 14 routes testées aux trois largeurs ; aucune erreur JavaScript observée.
- Captures de tous les écrans principaux et sous-écrans produites aux trois largeurs. Accueil 390px inspecté visuellement ; défilement vertical nécessaire et navigation basse persistante.
- La première exécution a révélé une route initiale vide ; corrigée avant les tests réussis. Les premiers lancements navigateur ont nécessité le même contexte réseau que le serveur local.

## Limites et validations restantes

- Application web de prototype, aucun build natif. Tests téléphone physique iOS/Android, Safari, encoche réelle, lecteur d’écran et fermeture/reprise restent à effectuer.
- Direction artistique à valider : carte et silhouettes volontairement provisoires ; pas d’assets gardiens définitifs intégrés.
- Catalogue de trois exemples uniquement ; IDs préfixés `demo-`, aucune statistique ou compétence canonique. Noms, classes, conditions de déblocage, synergies et portraits à fournir/valider avec le collègue.
- Aucun parcours de combat simulé, résultat de victoire/défaite, sauvegarde versionnée, backend, paiement, compte ou progression réelle : ces lots sont ultérieurs à META-01.
- Préférences et filtres en mémoire de session ; aucun paramètre audio actif car aucun son.
- Contrat GameBridge, format du montage moteur et gestion du cycle de vie restent proposés. Les tests de contrat complets listés dans le cadrage seront nécessaires lors de l’intégration.
- Avant fusion : revue UX/DA, appareils réels et validation conjointe des interfaces. Ne pas confondre cette livraison avec une fonctionnalité de production définitive.
