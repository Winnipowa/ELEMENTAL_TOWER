# Elemental Tower — Synthèse pour le collègue (04/11/2026)

**Références :** [GDD V1.1](GDD_V1.1.md) · [Plan d'exécution ET-001 à ET-012](PLAN_EXECUTION_P0_P2.md).
**Statuts dans le GDD :** ACTÉ = validé ; PROPOSÉ = hypothèse ; À TESTER = à mesurer.

## Décisions validées
- Mobile portrait, fantasy cute + dark, gardiens lisibles, démons noirs/violets.
- Auto-battler PvE / Tower Defense : boutique de gardiens, familles, classes, synergies, fusion identique 1★ à 5★.
- Collection et doctrines débloquées **durablement**. Étoiles, or et composition remis à zéro par expédition.
- **PvP : seulement les gardiens et doctrines débloqués personnellement.** Pas de catalogue complet prêté aux joueurs ; les déblocages restent gratuits.
- Deux monnaies : **or** temporaire de combat ; **diamants** achetés en euros, cosmétiques et Pass uniquement.
- Pas d'achat de puissance, de gardiens, de copies ni de rerolls en diamants ; XP ×2 éventuel sur le Pass cosmétique exclusivement.
- Pas d'énergie bloquante ni de publicités externes obligatoires au lancement.

## Hypothèses non validées à prototyper
- 12 vagues, boss 4/8/12, cible 10–15 minutes par expédition.
- 8 emplacements sur le terrain + 5 en réserve, 3 offres, revente à 60 %, déplacements gratuits.
- Défis PvP asynchrones avant le temps réel ; accès provisoire à partir de 6 gardiens avec 2 familles et 2 classes.
- Matchmaking tenant compte de **toute la collection** et de la compétence. Scores compétitifs vérifiés par le serveur.

## Travail du collègue — contenu et combat
1. Fournir des identifiants stables guardian_id, family_id, class_id, tags de synergie et données de rôle/contres.
2. Définir attaques, compétences chargées, animations 1★–5★, effets et silhouettes propres aux unités.
3. Fournir un contrat technique pour coûts, mana, dégâts, cadence, effets et événements de fusion/skill/synergie.
4. Équilibrer les compositions de début de collection ; aucune famille tardive ne doit écraser systématiquement les premières.
5. Prévoir les variantes cosmétiques sans changer hitbox, portée, statistiques ni lisibilité.

## Travail produit/UX/tech
- ET-001/002 : boucle d'expédition et fusion/réserve/revente sans frustration.
- ET-003/004 : télémétrie et test des premières sessions, au moins trois compositions viables.
- ET-005/006/007 : sauvegarde de collection, chapitres de déblocage et codex.
- ET-008/009/010 : règles de PvP personnel, défis asynchrones, contrôle serveur et comparaison des écarts de collection.
- ET-011/012 : boutiques cosmétiques et Pass après validation du plaisir de jeu.

## Prototype de référence
[Prototype V0.8 HTML (6 vagues)](../prototypes/elemental_tower_tft_pve_v08.html).
**Attention :** prototype exploratoire, pas code de production canonique ; ne pas remplacer le travail du collègue par ce fichier.

**Ordre :** contrat de données commun → expédition complète → sauvegarde de progression → tests → défi social → monétisation.
Les changements de PvP sur collection personnelle ou l'ajout de puissance payante nécessitent un nouvel aval.
