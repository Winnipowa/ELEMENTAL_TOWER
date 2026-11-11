# INT-01 — audit de la référence hors combat

Audit du 11 novembre 2026. Référence `0.4.0-int.1`, branche `feature/int-01-consolidated-reference`, créée depuis `feature/meta-04-products-settings`, PR #15, commit `832959fba650f55e301de2dddc4e2e6db53e829f`. Revue empilée sur cette branche, aucune fusion ni mise en production.

## Conclusion et portée

META-01, META-02, META-03, META-04, DA-01, DA-02, DA-03, DA-04 et UX-01 sont présents par ascendance Git. La coquille fonctionne sans moteur : elle reste une démonstration locale. Le futur moteur réel ne peut pas être branché tel quel ; les obstacles sont détaillés dans le [rapport GameBridge](INT_01_GAMEBRIDGE_COMPATIBILITY.md). Le gameplay, les contrats, les catalogues, les assets, le CSS et les services de sauvegarde hérités de #15 restent inchangés.

L’audit couvre les sources `meta/`, leurs tests et leurs liens documentaires. Il ne certifie ni le moteur du collègue, ni les anciens prototypes jouables, ni une application native. Les vérifications de stockage s’effectuent dans des contextes navigateur temporaires avec des fixtures ; aucune sauvegarde personnelle n’est lue ou réécrite.

## Historique et dépendances des PR

Les onze PR sont ouvertes, Draft et non fusionnées lors de l’audit GitHub. Les instantanés et SHA complets sont conservés dans [pr-history.json](audit/int-01/pr-history.json).

| PR | Lot / branche | Base déclarée | Présence dans #15 |
|---|---|---|---|
| #5 | Périmètre/contrat, `meta-app-shell-v1` | main | Oui, `d9445f5` |
| #6 | META-01, `meta-01-mobile-shell` | main | Oui, `8d45fe6` |
| #7 | META-02, `meta-02-expedition-flow` | #6 | Oui, `8a8bdd9` |
| #8 | META-03, `meta-03-collection-progression` | #7 | Oui, `812d579` |
| #9 | Charte documentaire, `da-01-midnight-elemental` | #8 | Non, branche parallèle `371f8d9` |
| #10 | DA-01 implémentée, `da-01-night-palette` | #8 | Oui, `2346dcf` |
| #11 | DA-02, `da-02-soft-fantasy` | #10 | Oui, `9f6070b` |
| #12 | DA-03, `da-03-guardian-art` | #11 | Oui, `36da594` |
| #13 | DA-04, `da-04-ui-color` | #12 | Oui, `66814ef` |
| #14 | UX-01, `ux-01-game-interface` | #13 | Oui, `bf7524a` |
| #15 | META-04, `meta-04-products-settings` | #14 | Oui, `832959f` |

La description de #5 parle de documentation seule, mais sa branche a ensuite reçu du code META-01 ; #6 hérite de ces commits. Il s’agit d’un recouvrement de revue, pas de deux shells exécutés en parallèle. Aucune fusion de #5/#6 n’est nécessaire pour consolider #15.

#9 ajoute seulement `docs/ART_DIRECTION_NIGHT_BLUE_V1.md` et n’est pas dans la chaîne #10–#15. Les principes manquants utiles sont synthétisés avec provenance dans la [charte de référence](ART_DIRECTION_REFERENCE.md). L’ancienne palette et le ratio historique 80/15/5 ne remplacent pas la DA pastel actuelle. Aucun cherry-pick ni remplacement du CSS.

## Vérifications des sources et des données

- Modules ES natifs ; aucun paquet de production. Playwright est une dépendance de développement. Ses imports et les imports relatifs sont résolus ; aucun import de moteur depuis `meta/`.
- Catalogue central externe : 3 gardiens, 4 régions, 3 familles, 2 classes, 1 synergie, 2 chapitres et 2 objectifs. Une région de départ est proposée à l’expédition de démonstration. Catalogues produits : 6 missions, 5 cosmétiques dans 5 catégories, 3 paliers de Pass. Tous restent explicitement fictifs, schéma 1.
- Les versions de données sont indépendantes de la version du shell : le ruleset `demo-meta-01`, le format de sauvegarde 2 et les préférences 1 restent conservés. Aucun renommage d’identifiant canonique ni conversion de données de démonstration.
- Six planches PNG fournies, empreintes SHA-256 vérifiées, mappings `art.js` inchangés. Les portraits visibles Luma/Mousse/Nyx utilisent ces références ; les poses de Nyx ne deviennent pas des rangs inventés. Trois anciens SVG sont conservés comme ressources historiques/fallback, sans réintroduire leurs personnages dans les cartes actuelles.
- Aucun fichier de runtime strictement identique à un autre par SHA-256. Les surcharges CSS successives et quelques utilitaires de rendu similaires restent une dette de maintenance volontairement non refactorisée pendant cette consolidation.
- Les liens locaux de documentation sont contrôlés. Les pages inconnues, gardien/produit manquant et expédition/résultat sans session disposent de replis. Les ressources courantes sont servies localement sans 404 dans la matrice de test.
- Sauvegarde de démonstration `elemental-tower.meta-demo.v2` et préférences `elemental-tower.meta-preferences.v1` isolées. Ancien format, JSON corrompu, version future, catalogue retiré et conflits sont couverts ; l’ouverture ne doit pas écraser les octets existants. Les sauvegardes V0.9 ne sont pas utilisées par le shell.

## Corrections de consolidation

| Constat | Correction / décision |
|---|---|
| Version du shell absente du package, version Paramètres codée en dur | Version unique exportée par `meta/version.js`, package et lock cohérents : `0.4.0-int.1` |
| Plage Playwright plus large que le paquet installé | Épinglage à 1.65.0, déjà résolu dans le lock initial ; aucune montée de version |
| Ancien gestionnaire de prévisualisation boutique sans appelant | Retrait du listener `data-preview`, les fiches META-04 restent le chemin actif |
| Serveur de test : encodage URL invalide susceptible d’arrêter le processus, types PNG/JSON incomplets | Réponses 400/403/404/405, MIME explicites, GET/HEAD, test unitaire ; serveur strictement local |
| Attente fixe de démarrage et port 4173 partagé | Attente de disponibilité/échec explicite et port isolé configurable ; aucun processus tiers arrêté |
| Pas de campagne de référence unifiée | `npm run test:reference`, rapports machine, audit de ressources, 24 routes et relecture des lots visuels |
| Charte #9 hors de l’ascendance | Synthèse documentaire sourcée sans modification de la DA courante |

Un premier lancement a révélé une collision avec un serveur déjà présent sur 4173. Le harnais isole maintenant son port. Une assertion du nouveau test INT-01 attendait à tort que le titre d’accueil soit détaché ; elle a été corrigée pour attendre son affichage. Ces incidents de validation n’étaient pas des régressions fonctionnelles de l’application. Les assertions héritées n’ont pas été assouplies.

## Environnement et reproduction

Windows, Node 24.2.0, npm 11.3.0, Edge 157.0.4341.46, Playwright 1.65.0. `npm ci --ignore-scripts` exécuté avec succès. `npm audit --json` : aucune vulnérabilité déclarée par le registre au moment de l’audit ; cela ne vaut pas garantie future. Pas de dépendance npm de production.

Depuis un clone contenant l’historique des commits cités :

```sh
npm ci --ignore-scripts
npm run test:reference
npm start
```

Ouvrir `http://127.0.0.1:4173/meta/index.html`. Node 24+ et Edge installé sont les prérequis de cette campagne Windows. `ELEMENTAL_TEST_PORT` permet d’imposer un autre port libre ; la campagne complète choisit un port éphémère par défaut. Le replay historique requiert Git, tar et les commits antérieurs : un clone superficiel doit récupérer cet historique. Aucun téléchargement de navigateur ou déploiement n’est lancé automatiquement.

## Résultats et preuves

La campagne complète produit `test-results/int-01/test-results.json`, un journal par étape, `static-audit.json`, `browser-audit.json`, `visual-history.json` et les captures courantes. Les instantanés livrés sont dans [audit/int-01](audit/int-01/test-results.json).

**Résultat final : les six étapes ont terminé avec le code 0, 27 tests unitaires réussis, aucun échec ni test unitaire ignoré.** Les trois suites navigateur courantes et les cinq replays historiques ont tous réussi. La commande complète `npm run test:reference` a terminé avec le code 0.

| Campagne | Couverture |
|---|---|
| Statique | 34 JS/MJS analysés, 115 imports inventoriés, 22 fichiers protégés identiques à #15, références PR et liens locaux |
| Unitaire | 27 tests : bridge/session, progression, catalogue, vues, produits/préférences, provenance artistique, serveur local |
| Navigation héritée | Navigation/retours, expédition victoire/défaite/abandon/erreurs, collection/QA/sauvegardes et UX |
| Produits hérités | Missions, filtres/fiches, Pass, préférences, états erreur/chargement et absence de transactions |
| INT-01 navigateur | 24 routes × 4 formats : 320×844, 390×844, 430×844, 320×568 ; IDs DOM uniques, aucune erreur JS/ressource, aucun appel moteur/externe/écriture HTTP ; sauvegardes inchangées, quatre anciens formats en lecture seule |
| Replays visuels | DA-01, DA-02, DA-03, DA-04, UX-01 sur leur commit propre, avant/après à 320/390/430 ; seule adaptation du port dans les copies de tests |

Les replays historiques sont distincts des tests du code actuel : leurs anciens sélecteurs correspondent à leur ancien DOM. Ils vérifient que leurs campagnes sont encore reproductibles ; la navigation/UX et l’audit INT-01 valident la référence actuelle. Les contrastes vérifiés par ces scripts concernent des paires précises, sans certification globale WCAG. Quarante-quatre captures courantes sont livrées ; les captures historiques originales restent dans le dépôt et les nouvelles relectures dans le dossier ignoré de résultats.

## Limites et validation humaine

Pas de régression fonctionnelle restante identifiée dans le périmètre automatisé. La qualification porte sur Edge émulant des formats mobiles, sans prétendre valider Safari/iOS, Android physique, clavier virtuel, lecteur d’écran, écran à encoche ou mémoire/performance native. Les six planches originales représentent environ 17 Mo : découpe/optimisation et budget mobile restent à décider sans altérer leur provenance.

À valider humainement : saturation/glow et équilibre bleu nuit/pastel, lisibilité des petites légendes et des états verrouillés, correspondance des portraits/FX avec les IDs canoniques, informations de confidentialité finales. Aucun changement artistique ou contractuel n’est considéré comme approuvé par cette passe.

Consulter l’[inventaire fonctionnel](INT_01_INVENTORY.md), la [compatibilité moteur](INT_01_GAMEBRIDGE_COMPATIBILITY.md) et les [travaux avant build mobile](INT_01_MOBILE_CHECKLIST.md).
