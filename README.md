# ELEMENTAL TOWER

Jeu mobile portrait associant auto-battler, Tower Defense, collection de gardiens, synergies et fusion de 1★ à 5★.

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
