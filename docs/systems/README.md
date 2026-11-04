# Système de données — Elemental Tower

Pack produit **V0.1, PROPOSÉ**. Documentation compatible avec le GDD V1.1. Il structure les mots-clés, l’affichage, les fiches gardiens et les augments sans présumer que ces fonctions sont déjà codées.

## Documents

1. [SYSTEM_GLOSSARY](SYSTEM_GLOSSARY.md) — registre unique, définitions, stat vs effet et règles de calcul.
2. [UI_KEYWORDS_STYLEGUIDE](UI_KEYWORDS_STYLEGUIDE.md) — symboles et tooltips cohérents, formats et accessibilité mobile.
3. [GUARDIAN_TEMPLATE](GUARDIAN_TEMPLATE.md) — contrat de fiche gardien que le collègue peut remplir.
4. [AUGMENT_LIBRARY](AUGMENT_LIBRARY.md) — 27 augments, argent/or/prismatique ; déclenchements et limitations.

## Données et assets

- [keywords.json](../../game-data/systems/keywords.json) — 33 entrées et IDs canoniques proposés.
- [augments.json](../../game-data/systems/augments.json) — 27 propositions et effets déclaratifs.
- [guardian_template.json](../../game-data/systems/guardian_template.json) — fiche d’exemple non canonique à dupliquer.
- [system-icons.svg](../../assets/ui/system-icons.svg) — symboles SVG réutilisables par ID.

**Aucun guardien du collègue n'a été remplacé ; aucun système d'augments n'a été ajouté dans le prototype V0.8.** Les valeurs sont à affiner, la majorité des effets demandent encore une adaptation moteur.

**P0 ensuite** : associer ses IDs existants au registre et implémenter seulement trois augments pilotes (un stat, un déclencheur, un transformateur de comportement) avant de bâtir le catalogue complet.
