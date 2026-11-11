# Preuves PERF-01 — 11 novembre 2026

- [Résultats des quatre étapes](test-results.json), [campagne héritée](reference-results.json) et [QA mobile courante](mobile-regression.json).
- [Benchmark apparié](performance.json) : 30 ouvertures, profils, temps de disponibilité visible, FCP, octets terminés à ce moment puis vague initiale totale, fichiers et RGBA nominal.
- [QA PERF-01 et inventaire froid](browser.json) : 48 contrôles RGBA, différé/galeries/modal/cleanup, rectangles des vues et 17 routes avant/après.
- [Provenance des 24 crops](assets.json), [audit statique](static-audit.json) et [environnement / fichiers préservés](environment.json).

Les PNG correspondants sont dans `meta/art/sprites/`, les sources inchangées dans `meta/art/sources/` et les planches META-05 inchangées dans `meta/art/mobile/`. Le manifeste associe chaque crop à sa source SHA-256, son rectangle logique inchangé et son rectangle physique avec marge. Le build ne dépend pas de l’index généré préexistant.

Les dossiers `test-results/` des JSON sont des artefacts locaux ignorés de Git, recréés par `npm run test:perf`. L’archive de preuves livrée contient les journaux et les **144 captures**, sans embarquer les anciennes archives de replay ou les mesures pilotes écartées. Aucun résultat physique Android/Safari n’est impliqué.

## Exemples comparatifs

| Écran | Avant : état de la PR #17 | Après PERF-01 |
|---|---|---|
| Collection petit écran | [320×568](screens/edge-before-collection-320x568.png) | [320×568](screens/edge-after-collection-320x568.png) |
| Luma | [390×844](screens/edge-before-guardian-demo-luma-390x844.png) | [390×844](screens/edge-after-guardian-demo-luma-390x844.png) |
| FX WebKit Windows | [390×844](screens/webkit-before-luma-fx-390x844.png) | [390×844](screens/webkit-after-luma-fx-390x844.png) |
| Évolutions WebKit Windows | [390×844](screens/webkit-before-luma-ranks-start-390x844.png) | [390×844](screens/webkit-after-luma-ranks-start-390x844.png) |
| Codex | [430×844](screens/edge-before-synergies-430x844.png) | [430×844](screens/edge-after-synergies-430x844.png) |

L’égalité automatisée stricte porte sur les données RGBA et coordonnées, pas sur la rastérisation complète d’un screenshot. La revue humaine des contours/glows et les essais sur téléphone restent à effectuer.
