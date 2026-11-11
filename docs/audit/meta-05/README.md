# Preuves META-05 — 11 novembre 2026

- [Campagne globale](test-results.json) : trois étapes terminées avec code 0.
- [QA Edge/WebKit](browser.json) : versions, viewports, 192 visites, capacités, RGBA, écarts de screenshots et conditions dégradées.
- [Mesures brutes](performance.json) : 12 ouvertures froides, ressources, FCP, long tasks, heap/DOM et insets synthétiques.
- [Assets dérivés et provenance](assets.json) : octets, dimensions, SHA sources/dérivés, empreinte RGBA et recette d’encodage. Les fichiers optimisés se trouvent dans `meta/art/mobile/`, les sources inchangées dans `meta/art/sources/`.
- [Référence héritée](reference-results.json), [audit statique](static-audit.json) et [environnement/frontières](environment.json).

Les chemins de `test-results/` figurant dans les JSON sont des artefacts générés ignorés de Git. La campagne les recrée ; l’archive de preuves remise avec la mission contient les journaux et les 141 captures finales. Les anciens résultats INT-01 restent archivés dans leur propre dossier, sans être réécrits comme s’ils décrivaient META-05.

## Captures de revue

| Sujet | Capture |
|---|---|
| Collection / petit écran Edge | [320×568](screens/edge-collection-320x568.png) |
| Gardien WebKit Windows | [390×844](screens/webkit-guardian-demo-luma-390x844.png) |
| Boutique WebKit Windows | [430×844](screens/webkit-shop-430x844.png) |
| Source PNG / Edge | [Luma 390](screens/edge-original-guardian-demo-luma-390.png) |
| PNG optimisé / Edge | [Luma 390](screens/edge-optimized-guardian-demo-luma-390.png) |
| Source PNG / WebKit | [Luma 390](screens/webkit-original-guardian-demo-luma-390.png) |
| PNG optimisé / WebKit | [Luma 390](screens/webkit-optimized-guardian-demo-luma-390.png) |
| Sources et dérivés indisponibles | [Repli WebKit](screens/webkit-asset-unavailable-320x568.png) |
| Insets 47/34 synthétiques | [Edge](screens/edge-safe-area-47-34.png) |

Les captures comparatives Edge utilisent le rendu logiciel pour limiter le bruit A/A ; les vues de QA et les mesures utilisent le moteur normal. Les écarts restent consignés, aucun screenshot n’est présenté comme certification de parité visuelle. L’égalité stricte porte sur les pixels RGBA des six assets dans les deux décodeurs.

**Aucun appareil physique, clavier OS, Safari iOS ou Retour système Android n’a été validé. Aucun analytics n’est émis.**
