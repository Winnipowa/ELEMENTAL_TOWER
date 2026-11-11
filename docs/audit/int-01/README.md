# Preuves INT-01

Instantanés de la campagne du 11 novembre 2026, depuis PR #15. Les JSON décrivent la campagne exécutée, pas un résultat permanent garanti pour de futurs commits.

- [Historique des PR #5–#15](pr-history.json) et [analyse statique / ascendance / fichiers protégés](static-audit.json).
- [Résultats des six étapes](test-results.json), [audit navigateur des 24 routes](browser-audit.json), [cinq replays historiques](visual-history.json) et [environnement / audit npm](environment.json).
- Les chemins `test-results/` des JSON sont des artefacts générés ignorés par Git. `npm run test:reference` les recrée, y compris les journaux et les 44 captures courantes. Les ports éphémères des URL de ressources sont propres à cette exécution.
- Les répertoires de replay sont des exports temporaires des commits historiques ; leurs tests sont adaptés uniquement pour le port. Ils ne constituent pas une seconde application intégrée.

## Échantillon de captures courantes

Les autres captures des quatre résolutions sont livrées avec l’archive de preuves de la mission. Cette consolidation ne modifie pas la DA : il s’agit de captures de qualification de la référence, sans avant/après artistique artificiel.

| Écran | Capture |
|---|---|
| Collection petit écran | [320 × 568](screens/collection-320x568.png) |
| Gardien | [390 × 844](screens/guardian-demo-luma-390x844.png) |
| Missions | [390 × 844](screens/missions-390x844.png) |
| Boutique | [390 × 844](screens/shop-390x844.png) |
| Pass | [390 × 844](screens/pass-390x844.png) |
| Préparation | [390 × 844](screens/prepare-390x844.png) |
| Résultat simulé | [390 × 844](screens/result-390x844.png) |
| Paramètres | [430 × 844](screens/settings-430x844.png) |
