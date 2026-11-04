# AUGMENT_LIBRARY — bibliothèque V0.1

**État : PROPOSÉ, aucun augment n’est présumé implémenté.** Inspiré de la profondeur des choix d’augments de jeux auto-battlers ; aucun nom ou effet n’est copié.

**Source machine** : [`game-data/systems/augments.json`](../../game-data/systems/augments.json). **Références** : [Glossaire](SYSTEM_GLOSSARY.md), [Charte tooltips](UI_KEYWORDS_STYLEGUIDE.md).

## Règles du prototype (à tester)

- Expédition test du GDD : **12 vagues**, avec boss **4 / 8 / 12** ; choix d’augment **après la vague 5**, puis **après la vague 10**. La vague 15 concerne seulement un hypothétique mode plus long.
- Chaque choix : **3 propositions, 1 sélection**, entre les combats ; aucun timer punitif au tutoriel.
- Tirage depuis les augments admissibles aux gardiens **posés** ; ajouter des propositions universelles si nécessaire. Les propositions d’une même offre doivent être distinctes.
- Les augments sont **temporaires pour l’expédition** et se réinitialisent à la fin ; pas de puissance persistante achetable.
- **PvE uniquement pour les premiers tests**. Les autoriser en PvP exigerait des règles déterministes, du matchmaking et une validation serveur spécifiques.
- Les nombres/conditions des exemples ci-dessous ne sont pas équilibrés. Une compétence exclue par le tag `requires_tag` ne reçoit pas son effet par défaut.

## Catalogue — 27 augments

### Argent

#### Éclat précis (`ag_s01_eclat_critique`)
- **Catégorie** : offense · **Conditions** : universel
- **Effet (provisoire)** : Tous vos gardiens gagnent +10 % de chance de critique.
- **Mots-clés** : `crit_chance`
- **Lisibilité** : Étoile blanche discrète lors d’un coup critique.

#### Cadence harmonieuse (`ag_s02_cadence`)
- **Catégorie** : offense · **Conditions** : universel
- **Effet (provisoire)** : Tous vos gardiens gagnent +12 % de vitesse d’attaque.
- **Mots-clés** : `attack_speed`
- **Lisibilité** : Traînée courte sur les projectiles.

#### Rempart vivant (`ag_s03_rempart`)
- **Catégorie** : defense · **Conditions** : class:gardien
- **Effet (provisoire)** : Au début de chaque vague, vos Gardiens reçoivent un bouclier de 12 % de leurs PV max.
- **Mots-clés** : `shield`, `hp`
- **Lisibilité** : Halo autour du bouclier.

#### Flux arcanique (`ag_s04_flux`)
- **Catégorie** : mana · **Conditions** : class:arcaniste
- **Effet (provisoire)** : Vos Arcanistes génèrent 15 % de mana supplémentaire.
- **Mots-clés** : `mana_gain`
- **Lisibilité** : Orbe de mana plus lumineuse.

#### Œil du Chasseur (`ag_s05_oeil_chasseur`)
- **Catégorie** : offense · **Conditions** : class:chasseur
- **Effet (provisoire)** : Vos Chasseurs gagnent +25 % de dégâts critiques (multiplicateur).
- **Mots-clés** : `crit_damage`
- **Lisibilité** : Flash en pointe sur un critique.

#### Racines tenaces (`ag_s06_racines_douces`)
- **Catégorie** : control · **Conditions** : family:sylve
- **Effet (provisoire)** : Les ralentissements appliqués par la Sylve durent 25 % plus longtemps.
- **Mots-clés** : `slow`
- **Lisibilité** : Fines racines sous les ennemis ralentis.

#### Aubaine de combat (`ag_s07_aubaine`)
- **Catégorie** : economy · **Conditions** : universel
- **Effet (provisoire)** : Après chaque vague terminée, gagnez 10 or de combat supplémentaires.
- **Mots-clés** : `gold`, `wave`
- **Lisibilité** : Pièces dorées au bilan de vague.

#### Second regard (`ag_s08_choix`)
- **Catégorie** : economy · **Conditions** : universel
- **Effet (provisoire)** : Après chaque vague terminée, gagnez une relance gratuite, non cumulable au-delà de 2.
- **Mots-clés** : `reroll`, `wave`
- **Lisibilité** : Icône de relance éclairée.

#### Morsure du Crépuscule (`ag_s09_sombre`)
- **Catégorie** : magic · **Conditions** : family:crepuscule
- **Effet (provisoire)** : Les compétences du Crépuscule infligent +12 % de dégâts.
- **Mots-clés** : `skill_damage`
- **Lisibilité** : Impulsion violette sur les sorts.

#### Endurance (`ag_s10_vie`)
- **Catégorie** : defense · **Conditions** : universel
- **Effet (provisoire)** : Tous vos gardiens gagnent +12 % de PV maximum.
- **Mots-clés** : `hp`
- **Lisibilité** : Halo vert doux.

#### Étude des colosses (`ag_s11_tueur`)
- **Catégorie** : offense · **Conditions** : universel
- **Effet (provisoire)** : Tous vos gardiens infligent +18 % de dégâts aux boss.
- **Mots-clés** : `boss_damage`
- **Lisibilité** : Éclat de couronne sur boss.

### Or

#### Arc de précision (`ag_g01_rebond_crit`)
- **Catégorie** : offense · **Conditions** : class:chasseur
- **Effet (provisoire)** : Les critiques des Chasseurs rebondissent vers 2 ennemis proches, infligeant 45 % des dégâts initiaux.
- **Mots-clés** : `crit_chance`, `chain`
- **Lisibilité** : Liaison lumineuse entre cibles.

#### Double convergence (`ag_g02_projectiles`)
- **Catégorie** : magic · **Conditions** : class:arcaniste
- **Effet (provisoire)** : Les compétences offensives des Arcanistes créent un projectile supplémentaire à 45 % des dégâts normaux.
- **Mots-clés** : `projectile_count`, `skill_damage`
- **Lisibilité** : Projectile secondaire distinct.

#### Protection partagée (`ag_g03_rempart_partage`)
- **Catégorie** : defense · **Conditions** : class:gardien
- **Effet (provisoire)** : Au début de la vague, chaque Gardien donne un bouclier de 8 % de ses PV max à un allié proche, sans se cibler lui-même.
- **Mots-clés** : `shield`
- **Lisibilité** : Lien de bouclier entre voisins.

#### Étreinte de Sylve (`ag_g04_etreinte`)
- **Catégorie** : control · **Conditions** : family:sylve
- **Effet (provisoire)** : La première compétence de zone d’un Sylve par vague immobilise ses cibles pendant 1,2 s.
- **Mots-clés** : `root`, `area`
- **Lisibilité** : Racines lumineuses sur les cibles.

#### Orage captif (`ag_g05_orage_captif`)
- **Catégorie** : synergy · **Conditions** : class:arcaniste, family:sylve
- **Effet (provisoire)** : Les dégâts de compétence d’un Arcaniste sur un ennemi immobilisé rebondissent vers 2 autres cibles à 35 % de puissance.
- **Mots-clés** : `root`, `chain`, `skill_damage`
- **Lisibilité** : Arc électrique reliant les immobilisés.

#### Art de la récupération (`ag_g06_fusion_lucrative`)
- **Catégorie** : economy · **Conditions** : universel
- **Effet (provisoire)** : Chaque fusion réussie rapporte 25 or de combat.
- **Mots-clés** : `fusion`, `gold`
- **Lisibilité** : Pièces au-dessus des fusions.

#### Élan de fusion (`ag_g07_elan_fusion`)
- **Catégorie** : offense · **Conditions** : universel
- **Effet (provisoire)** : Le gardien issu d’une fusion gagne +8 % de vitesse d’attaque pour la partie, jusqu’à 3 charges.
- **Mots-clés** : `fusion`, `attack_speed`
- **Lisibilité** : Couronne de trois petites barres.

#### Flèches perforantes (`ag_g08_percee`)
- **Catégorie** : offense · **Conditions** : class:chasseur
- **Effet (provisoire)** : Les projectiles de base des Chasseurs traversent 1 ennemi supplémentaire, à 50 % des dégâts.
- **Mots-clés** : `pierce`, `projectile_count`
- **Lisibilité** : Sillage lumineux continu.

#### Écho critique (`ag_g09_retour_mana`)
- **Catégorie** : mana · **Conditions** : universel
- **Effet (provisoire)** : Chaque coup critique donne 5 mana à son auteur. Maximum une fois par seconde et par gardien.
- **Mots-clés** : `crit_chance`, `mana`
- **Lisibilité** : Petite orbe après critique.

#### Brumes du Crépuscule (`ag_g10_brumes`)
- **Catégorie** : control · **Conditions** : family:crepuscule
- **Effet (provisoire)** : À chaque compétence de zone du Crépuscule, les ennemis touchés sont ralentis de 25 % pendant 2 s.
- **Mots-clés** : `slow`, `area`
- **Lisibilité** : Nuage violet au sol.

### Prismatique

#### Surcharge arcanique (`ag_p01_surcharge`)
- **Catégorie** : tradeoff · **Conditions** : class:arcaniste
- **Effet (provisoire)** : Les Arcanistes gagnent +35 % de génération de mana, mais leurs compétences infligent −15 % de dégâts.
- **Mots-clés** : `mana_gain`, `skill_damage`
- **Lisibilité** : Aura électrique instable.
- **Contrepartie / limite** : Fréquence de sort accrue contre puissance réduite.

#### Pluie de météores (`ag_p02_rage_projectiles`)
- **Catégorie** : tradeoff · **Conditions** : class:arcaniste
- **Effet (provisoire)** : Les compétences à projectiles des Arcanistes tirent 2 projectiles supplémentaires à 35 % de dégâts chacun ; leur attaque de base perd 15 % de dégâts.
- **Mots-clés** : `projectile_count`, `damage`
- **Lisibilité** : Pluie de projectiles roses.
- **Contrepartie / limite** : Attaque de base plus faible.

#### Forge sans fin (`ag_p03_forge`)
- **Catégorie** : economy · **Conditions** : universel
- **Effet (provisoire)** : Toutes les 3 fusions réussies, recevez gratuitement une copie 1★ du gardien fusionné, si une case de réserve est libre. Sinon, l’effet attend une place.
- **Mots-clés** : `fusion`, `bench`
- **Lisibilité** : Petit éclair sur la réserve.
- **Contrepartie / limite** : Accélération potentiellement forte ; test PvE uniquement.

#### Critiques en cascade (`ag_p04_etincelle`)
- **Catégorie** : offense · **Conditions** : universel
- **Effet (provisoire)** : Les coups critiques rebondissent vers 3 ennemis proches pour 40 % de leurs dégâts initiaux. Ne déclenche pas d'autres rebonds.
- **Mots-clés** : `crit_chance`, `chain`
- **Lisibilité** : Éclairs en cascade.
- **Contrepartie / limite** : Les rebonds ne peuvent pas déclencher le même augment.

#### Forteresse rapprochée (`ag_p05_rempart_lourd`)
- **Catégorie** : tradeoff · **Conditions** : class:gardien
- **Effet (provisoire)** : Les Gardiens gagnent +45 % de PV max et un bouclier de 20 % au début de vague, mais perdent 15 % de portée.
- **Mots-clés** : `hp`, `shield`, `attack_range`
- **Lisibilité** : Fortification avec runes.
- **Contrepartie / limite** : La portée plus courte pousse au placement stratégique.

#### Jugement du Crépuscule (`ag_p06_seuil`)
- **Catégorie** : offense · **Conditions** : family:crepuscule
- **Effet (provisoire)** : Les compétences du Crépuscule infligent 60 % de dégâts bonus aux ennemis sous 20 % PV. Contre les boss, bonus limité à 15 %.
- **Mots-clés** : `execute`, `skill_damage`
- **Lisibilité** : Marque noire et éclat violet.
- **Contrepartie / limite** : Effet plafonné contre les boss.

## Contrat technique des effets

Chaque entrée machine déclare :
- `id`, `tier`, `category`, `requires` et `keywords` pour filtrer, afficher et rechercher.
- `design_effects[]` avec `trigger`, `op`, `selector` et des paramètres typés.
- `pvp_allowed:false` par défaut.
- `visual_cue` : feedback obligatoire pour que le joueur comprenne l’impact.

Les opérations JSON (`modify_stat`, `chain_damage`, `apply_status`, etc.) sont des **intentions** de moteur ; elles ne sont pas de l’exécutable. Le développeur crée un adaptateur testable et renvoie une erreur claire si une opération n’est pas supportée. Ne pas ignorer silencieusement l’effet.

### Tests d’acceptation minimum

1. Les IDs sont uniques ; les mots-clés référencent tous le glossaire, les noms des familles/classes existent et les icônes sont résolues.
2. Une offre contient trois choix éligibles, différents, et sans blocage même quand la collection est petite.
3. Un augment prend effet dès la vague suivante, se voit en jeu, et disparaît à la fin de l’expédition.
4. Contrôler les cas cumulés : critique → rebond → rebond **non récursif**, fusions → copies quand réserve pleine, buffs limités.
5. Aucune gemme/diamant, aucun Pass premium ou achat ne permet d’obtenir un augment plus puissant.
6. Logs minimaux : `augment_offered`, `augment_selected`, `augment_triggered`, `augment_run_ended` ; aucun identifiant personnel nécessaire à l’analyse initiale.

### Équilibrage : pas encore validé

Points à mesurer : taux de choix, utilisation réelle, taux de victoire selon augment + collection disponible, durée des combats, combos dominants, temps perdu en lecture d’offres. Objectif initial : offrir plusieurs styles de parties, pas garantir une fréquence de Prismatique avant tests.
