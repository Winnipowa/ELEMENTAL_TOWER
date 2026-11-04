# GUARDIAN_TEMPLATE — fiche standard de gardien

**État : PROPOSÉ. À remplir par le collègue** pour chaque tour/gardien, sans écraser les classes/effets existants.

- Modèle de données : [`game-data/systems/guardian_template.json`](../../game-data/systems/guardian_template.json).
- Identifiants de familles/classes : [`keywords.json`](../../game-data/systems/keywords.json) (provisoires et à mapper si le code utilise d’autres IDs).
- Toute valeur `null` est **intentionnellement non décidée** : ne pas la remplacer par une constante fictive.
- Le personnage contenu dans le JSON est un **exemple fictif**, pas une validation de lore ni un ajout au roster.

## Champs obligatoires

| Champ | But |
|---|---|
| `id` | ID immuable, indépendant du nom FR |
| `display_name`, `family_id`, `class_id` | Présentation et synergies |
| `rarity`, `role`, `tags` | Pool de recrutement, gameplay, prérequis d’augment |
| `base_stats` | Dégâts, cadence, critique, PV, portée, mana (références du glossaire) |
| `attack`, `passive`, `skill` | Attaque propre, passif et compétence avec charge |
| `star_scaling` | 1★ à 5★, chiffres et visuels ; données distinctes de la collection |
| `synergy_references` | Liens vers la famille et la classe ; bonus calculés sur le terrain |
| `unlock` | Source déterministe de déblocage PvE, jamais argent premium |
| `visuals` | Portrait, silhouette, VFX d’attaque/compétence, skins |
| `tooltip` | Texte compact et détaillé générables à partir des effets |

## Exemple de texte (non canonique)

**Arcaniste d’Aurore** · 2★ · Famille Aurore · Classe Arcaniste

- **Attaque** — 2 projectiles qui ciblent le démon le plus avancé.
- **Passif** — attaques multiples.
- **Compétence : Orage** — lorsqu’il a assez de Mana, frappe jusqu’à 10 ennemis.
- **Synergie Arcaniste** — le bonus est issu d’une règle partagée, **pas recopié** dans chaque fiche.

Les valeurs de dégâts, charge, durée et progression d’étoiles doivent venir du travail d’équilibrage du collègue.

## Contrat d’intégration demandé au collègue

1. Envoyer IDs stables du roster, familles et classes ; garder une table de correspondance si les noms techniques actuels diffèrent.
2. Définir pour chaque effet : événement, cible, formule, durée, limites, effet visuel et interactions.
3. Signaler les compétences qui utilisent `projectile_attack`, `projectile_skill`, `area_skill` ; ces tags conditionnent l’éligibilité de certains augments.
4. Renvoyer les stats **par rang**, et dire si la fusion modifie seulement la puissance ou aussi l’attaque.
5. Ne pas modifier arbitrairement les IDs déjà sauvegardés ; versionner migrations et équilibres.

**Important :** le GDD valide la collection permanente et la remise à zéro des étoiles ; il ne fixe pas ici les détails de statistiques des neuf premiers gardiens.
