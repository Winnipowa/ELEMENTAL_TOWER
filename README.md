# ELEMENTAL TOWER

Jeu mobile portrait associant auto-battler, Tower Defense, collection de gardiens, synergies et fusion de 1★ à 5★.

## Illustrations PERF-01

[Rapport avant/après](docs/PERF_01_REPORT.md) : crops PNG sans perte, coordonnées et sources conservées, chargement à la visibilité et à l’ouverture des galeries. `npm run test:perf` exécute la non-régression et les mesures simulées ; `npm run assets:sprites` régénère les découpes avec FFmpeg. Aucun résultat de simulation ne vaut une validation sur téléphone physique.

## Préparation mobile META-05

Référence `0.4.1-meta.5`, dérivée d’INT-01 : [rapport QA](docs/META_05_QA_REPORT.md), [assets/performance](docs/META_05_PERFORMANCE.md), [packaging conditionnel](docs/META_05_PACKAGING.md), [analytics sans collecte](docs/META_05_ANALYTICS_PLAN.md), [protocole physique](docs/META_05_DEVICE_PROTOCOL.md) et [checklist bêta](docs/META_05_BETA_CHECKLIST.md).

`npm run test:mobile` exécute les tests hérités puis Edge/WebKit et les mesures desktop. Installer le runtime de test avec `npx playwright install webkit` si nécessaire ; `PLAYWRIGHT_BROWSERS_PATH` permet un emplacement local. `npm run assets:mobile` régénère les PNG dérivés avec FFmpeg, sans modifier les sources. Aucun téléphone physique, packaging natif, moteur réel ou service analytics n’est déclaré validé par ces commandes.

## Référence hors combat INT-01

La référence consolidée `0.4.0-int.1` part de la PR #15 et reste entièrement en démonstration, sans moteur canonique ni récompense réelle. Les sections historiques ci-dessous documentent les lots précédents.

[Audit et résultats](docs/INT_01_AUDIT.md) · [Inventaire fonctionnel/simulé/absent](docs/INT_01_INVENTORY.md) · [Compatibilité GameBridge](docs/INT_01_GAMEBRIDGE_COMPATIBILITY.md) · [Avant build mobile](docs/INT_01_MOBILE_CHECKLIST.md) · [Charte de référence et provenance #9](docs/ART_DIRECTION_REFERENCE.md).

Avec Node 24+ et Edge installé : `npm ci --ignore-scripts`, puis `npm run test:reference`. La campagne utilise un port isolé et nécessite l’historique Git pour les replays visuels. Pour consulter le prototype : `npm start`, puis ouvrir `http://127.0.0.1:4173/meta/index.html` (port adaptable via `ELEMENTAL_TEST_PORT`). Aucun déploiement n’est nécessaire.

## Documentation — à partager au collègue
1. [Synthèse des décisions / responsabilités (04/11/2026)](docs/HANDOFF_COLLEGUE_2026-11-04.md)
2. [Game Design Document V1.1](docs/GDD_V1.1.md) — règles validées, hypothèses, PvP à collection personnelle, économie et monétisation.
3. [Plan d'exécution ET-001 à ET-012](docs/PLAN_EXECUTION_P0_P2.md) — responsables, dépendances et critères d'acceptation.
4. [Prototype V0.8 HTML](prototypes/elemental_tower_tft_pve_v08.html) — référence jouable, pas moteur canonique.

## Décisions actées
- Collection durable, étoiles et or réinitialisés à chaque expédition.
- PvP avec sa propre collection ; aucun avantage de puissance payant.
- Or de combat et diamants premium uniquement pour les cosmétiques / Pass.
- Contenu/combat géré par le collègue ; progression, UX, économie, PvP/social et tests gérés côté produit.

**Attention :** 12 vagues, trois boss, seuil PvP et taux de revente sont des propositions à tester.

Conversion portrait V0.5 dans [PR #1](https://github.com/Winnipowa/ELEMENTAL_TOWER/pull/1), indépendante de ces documents.

## Langage système et augments (V0.1)

- **[Pack structuré pour le collègue](docs/systems/README.md)** — point d’entrée unique : 33 mots-clés, icônes SVG réutilisables, modèle gardien, 27 augments proposés et données JSON importables.
- [Glossaire](docs/systems/SYSTEM_GLOSSARY.md) · [Conventions UI / tooltips](docs/systems/UI_KEYWORDS_STYLEGUIDE.md) · [Fiche gardien](docs/systems/GUARDIAN_TEMPLATE.md) · [Bibliothèque d’augments](docs/systems/AUGMENT_LIBRARY.md).

> Les valeurs et compétences des augments sont des propositions de test PvE, non des fonctionnalités déjà implémentées ; ne pas intégrer automatiquement au moteur sans l’alignement des IDs et des stats du collègue.

## Coquille mobile META-01

Prototype local : [ouvrir les sources](meta/index.html). Installation et tests : [rapport META-01](docs/META_01_REPORT.md). Données fictives, moteur absent, aucune transaction.

## Parcours META-02

[Rapport et validation](docs/META_02_REPORT.md) : Monde → Préparation → GameBridge fictif → Résultats → Monde. Démonstration locale, sans récompense persistante.

## Collection et progression META-03

[Rapport et tests](docs/META_03_REPORT.md) · [Catalogue et raccordement du collègue](docs/META_03_CATALOG_HANDOFF.md). Catalogue externe et sauvegarde locale de démonstration uniquement ; aucun résultat mock n’accorde de progression.

## Missions, cosmétiques, Pass et préférences META-04

[Rapport fonctionnel](docs/META_04_REPORT.md) · [Raccordement futur](docs/META_04_INTEGRATION.md). Catalogues et progression QA fictifs, sans attribution ni paiement. Tests dédiés : npm run test:products.
