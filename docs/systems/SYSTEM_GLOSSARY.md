# SYSTEM_GLOSSARY — dictionnaire de jeu

**État : PROPOSÉ, à valider avec le collègue.** Le système de collection, l’or d’expédition, les diamants cosmétiques et le PvP personnel viennent du [GDD V1.1](../GDD_V1.1.md). Les stats/effets avancés ci-dessous ne sont **pas** tous implémentés.

## Source de vérité et principe

- La référence machine est [`game-data/systems/keywords.json`](../../game-data/systems/keywords.json).
- **Un concept = un ID stable**, affiché toujours avec le même symbole, le même intitulé et la même unité.
- Le moteur, les fiches gardiens, les augmentations et les tooltips utilisent l’ID : jamais une chaîne de texte « critique » libre.
- Catégories : `stat`, `effect`, `mechanic`, `currency`. Le symbole SVG se trouve dans [`assets/ui/system-icons.svg`](../../assets/ui/system-icons.svg).
- **Familles** : Aurore, Sylve, Crépuscule. **Classes** : Arcaniste, Gardien, Chasseur. IDs provisoires à mapper sur ceux du collègue.

## Registre des termes

| ID unique | Nom français | Type | Symbole | Définition (tooltip) |
|---|---|---|---|---|
| `damage` | Dégâts | stat | `#damage` | Dégâts de base d’une attaque ; sans bonus contextuels. |
| `crit_chance` | Chance de critique | stat | `#crit-chance` | Probabilité qu’un coup admissible soit critique (0 à 100 %). |
| `crit_damage` | Dégâts critiques | stat | `#crit-damage` | Multiplicateur des dégâts lors d’un coup critique (ex. 150 % = ×1,5). |
| `attack_speed` | Vitesse d’attaque | stat | `#attack-speed` | Cadence d’attaques par seconde, distincte du temps de recharge des sorts. |
| `skill_damage` | Dégâts de compétence | stat | `#skill` | Modificateur des dégâts d’un sort ; ne s’applique pas aux attaques ordinaires. |
| `boss_damage` | Dégâts aux boss | stat | `#boss` | Bonus de dégâts contre les ennemis marqués boss. |
| `hp` | Points de vie | stat | `#health` | Quantité de santé de l’unité ou de la structure. |
| `armor` | Armure | stat | `#shield` | Réduction des dégâts physiques selon une formule encore à valider. |
| `attack_range` | Portée | stat | `#range` | Distance maximale de ciblage d’une attaque ordinaire. |
| `mana` | Mana | stat | `#mana` | Ressource de compétence ; remise à la valeur de départ selon le combat. |
| `mana_gain` | Gain de mana | stat | `#mana` | Modificateur de génération de mana, distinct du coût de sort. |
| `projectile_count` | Projectiles | stat | `#projectiles` | Nombre de projectiles émis par une attaque ou un sort. |
| `shield` | Bouclier | effect | `#shield` | PV temporaires absorbant des dégâts avant les PV réels. |
| `slow` | Ralentissement | effect | `#slow` | Réduction de vitesse de déplacement pour une durée définie. |
| `root` | Immobilisation | effect | `#root` | Empêche le déplacement sans empêcher par défaut l’attaque. |
| `stun` | Étourdissement | effect | `#stun` | Empêche déplacement et attaque pendant la durée. |
| `burn` | Brûlure | effect | `#burn` | Dégâts périodiques durant un temps limité ; critique désactivé par défaut. |
| `mark` | Marque | effect | `#mark` | Étiquette temporaire appliquée à une cible, exploitable par une synergie. |
| `chain` | Rebond | mechanic | `#chain` | Effet ou projectile qui passe à une autre cible valide. |
| `pierce` | Perforation | mechanic | `#pierce` | Projectile traversant un nombre limité de cibles. |
| `area` | Zone | mechanic | `#area` | Zone d’application d’un effet ; rayon exprimé dans les unités du terrain. |
| `execute` | Exécution | mechanic | `#execute` | Dégâts ou élimination conditionnés à un seuil de PV ; règle boss spécifique. |
| `fusion` | Fusion | mechanic | `#fusion` | Deux copies du même gardien et du même rang donnent une copie du rang supérieur. |
| `reroll` | Relance | mechanic | `#reroll` | Renouvelle les offres de recrutement contre de l’or de combat, ou via jeton gratuit. |
| `gold` | Or | currency | `#gold` | Monnaie temporaire d’expédition ; réinitialisée à chaque partie. |
| `diamonds` | Diamants | currency | `#diamond` | Monnaie premium persistante : cosmétiques et Pass, jamais la puissance. |
| `augment` | Augment | mechanic | `#augment` | Modificateur de partie choisi lors d’une fenêtre de sélection ; non conservé. |
| `synergy` | Synergie | mechanic | `#synergy` | Bonus lié à une combinaison de familles/classes placées en combat. |
| `wave` | Vague | mechanic | `#wave` | Phase PvE délimitée par un début et une fin. |
| `bench` | Réserve | mechanic | `#bench` | Cases de stockage des gardiens hors terrain ; ne déclenchent pas les synergies. |
| `skill` | Compétence | mechanic | `#skill` | Action spéciale déclenchée selon la charge et les règles du gardien. |
| `cooldown` | Recharge | stat | `#cooldown` | Temps entre deux utilisations d’une même action. |
| `healing` | Soin | effect | `#health` | Restauration de PV sans dépasser les PV maximum sauf règle explicite. |

## Contrat de calcul (propositions à tester)

1. `crit_chance` est une **probabilité** et `crit_damage` un **multiplicateur** : `10 % de chance` n’est pas `+10 % de dégâts critiques`. Exemple : 150 % de dégâts critiques = dégâts normaux ×1,5.
2. Une attaque critique n’existe que pour les sources explicitement autorisées à critiquer. **Par défaut**, dégâts périodiques, boucliers et soins ne critiquent pas.
3. Les bonus de même stat exprimés en points de pourcentage s’additionnent, puis les multiplicateurs finaux s’appliquent ; **ordre exact à figer avec le moteur**. La chance de critique finale est bornée à `[0 %, 100 %]`.
4. Les buffs ont des durées et des sources explicites. Deux mêmes effets de contrôle ne doivent pas s’étendre indéfiniment par accident ; définir par effet : `refresh`, `max` ou `stack`. **Pas de cumul implicite.**
5. `shield` absorbe les dégâts avant `hp`. Si plusieurs boucliers coexistent, définir et tester une priorité déterministe.
6. Une synergie se calcule à partir des **gardiens distincts présents sur le terrain**, pas des copies de réserve ; ce détail dépend du contrat validé avec le collègue.
7. `gold` = session seulement. `diamonds` = achat premium persistant. Aucun effet d’augment ni Pass ne doit attribuer de diamants ou donner de la puissance achetable.
8. Les termes `armor`, `healing`, `mark`, `root`, `pierce`, `execute` sont des capacités **candidates**. Ne pas les coder toutes avant d’en avoir besoin.

## Nommage, version et migration

- IDs permanents : `snake_case`. Identifiant différent quand la règle diffère, même si le symbole se ressemble.
- Champ `status` et `implemented` séparent concept / prototype / moteur.
- Toute modification de formule demande un changement versionné et une revue avec les stats du collègue.
- Ne pas importer les exemples de données comme gardiens officiels.
