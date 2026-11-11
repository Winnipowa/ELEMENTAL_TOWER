# Elemental Tower — Vertical Slice V0.9 (expédition PvE)

**Statut :** prototype d'intégration proposé à tester ; **ne pas fusionner à l'aveugle** avec le travail de création de gardiens du collègue.

## Où jouer

[Ouvrir le prototype HTML V0.9](../prototypes/elemental_tower_vertical_slice_v09.html) en local dans un navigateur (fichier autonome).

## Boucle disponible

1. Accueil → collection (4 gardiens disponibles au début) → lancer une expédition.
2. Acheter, placer, fusionner, relancer la boutique en **or de combat**.
3. Défendre **12 vagues** avec boss **4/8/12** et lancement manuel entre les vagues.
4. Choisir **1 augment parmi 3** après les vagues **5 et 10** (10 augments pilotes jouables ; les 17 autres sont toujours des fiches de design).
5. Victoire/défaite → bilan → déblocages permanents selon les vagues franchies → rejouer.
6. Collection sauvegardée dans `localStorage` sur le navigateur et l'appareil. **Pas de compte, cloud, sync, anti-triche ni PvP**.

## Déblocages PROPOSÉS

| Vague atteinte et terminée | Gardien débloqué |
|---|---|
| Début | Luma, Solis, Aéri, Mousse |
| 2 | Néma |
| 4 | Fougri |
| 6 | Nyx |
| 8 | Brume |
| 10 | Noctis |

Progression gardée après la défaite si les vagues ont bien été terminées. Les achats, rangs et or **ne persistent pas**. Mode Atelier : ressources abondantes, roster complet, aucune progression sauvegardée.

## Augments pilotes réellement codés

| ID (source de vérité : augments.json) | Effet implémenté |
|---|---|
| `ag_s01_eclat_critique` | 10 points de chance de critique supplémentaires |
| `ag_s02_cadence` | 12 % de vitesse d’attaque |
| `ag_s07_aubaine` | 10 or après vague |
| `ag_s08_choix` | 1 relance gratuite après vague, plafond 2 |
| `ag_s11_tueur` | 18 % de dégâts aux boss |
| `ag_g01_rebond_crit` | Les critiques des Chasseurs rebondissent vers 2 cibles |
| `ag_g06_fusion_lucrative` | 25 or par fusion |
| `ag_g07_elan_fusion` | 8 % de vitesse par fusion, plafond 3 charges |
| `ag_g09_retour_mana` | 5 mana par critique avec recharge de 1 s |
| `ag_p04_etincelle` | Les critiques rebondissent vers 3 cibles, sans récursion |

**Important :** les compétences actuelles ont été conservées depuis la V0.8. Ces augments pilotes sont codés sur la mécanique existante, pas sur un moteur unifié d'effets. Il faudra intégrer les IDs, familles, VFX et stats définitifs du collègue.

## Résultats de test

- Contrôle syntaxique JavaScript via `node --check`.
- Tests de navigateur Chromium aux largeurs **320, 390 et 430 px** sans erreur JavaScript visible : menu → collection → partie, sélection d'augment, fin de 12 vagues, déblocages, et présence du boss à la vague 4.
- Le scénario automatisé de bout en bout **force la fin des vagues** pour tester la progression, il **ne démontre pas** que la difficulté soit équilibrée ni qu'une victoire soit atteignable par un joueur ordinaire.

## À faire avant diffusion à des testeurs

- [ ] Tester de vraies parties complètes sans simulation forcée (au moins 10 testeurs) ; régler dégâts, gold, vitesse et temps de partie.
- [ ] Valider que les boss n'engendrent pas de difficulté impossible ou triviale.
- [ ] Synchroniser les 9 gardiens et leurs compétences avec le travail du collègue ; IDs stables.
- [ ] Vérifier les 10 augments sur leurs déclencheurs, avec les combinaisons de synergies.
- [ ] Refonte de la progression sauvegardée via compte/serveur pour le produit final.
- [ ] Remplacer tout contrôle purement client avant PvP compétitif.
- [ ] Prévoir tutoriel contextuel complet, instrumentation et reprise de partie.
- [ ] Effectuer les tests réels iOS/Android, touch, zones sûres et accessibilité.

## Politique de merge

Cette PR est intentionnellement non fusionnée ; le code reste dans `prototypes/` pour **ne pas remplacer ni gêner le chantier gardiens/familles/effets du collègue**. Elle sert de référence d'intégration. Toutes les autres décisions du [GDD V1.1](GDD_V1.1.md) restent en place.
