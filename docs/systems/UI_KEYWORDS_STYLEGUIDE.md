# UI_KEYWORDS_STYLEGUIDE — grammaire visuelle et tooltips

**État : PROPOSÉ.** Objectif : interface portrait « fantasy premium cute + dark », descriptions rapides à comprendre et cohérentes sur tous les écrans, sans copier la DA de League of Legends.

## 1. Icônes : un concept, une signature

- Source machine : [`keywords.json`](../../game-data/systems/keywords.json), champ `icon_id`.
- Source visuelle : [`system-icons.svg`](../../assets/ui/system-icons.svg), sprite contenant un `<symbol id="crit-chance">` etc.
- Exemple dans une page web servie sur HTTP : `<svg class="keyword-icon" aria-hidden="true"><use href="/assets/ui/system-icons.svg#crit-chance"></use></svg>`
- **Critique** : `crit-chance` = étoile avec noyau ; **dégâts critiques** = `crit-damage` = étoile radiale. Deux symboles différents.
- Zone tactile minimale proposée : 44×44 CSS px pour la fiche/tooltip ; pictogramme rendu 20–24 CSS px dans les lignes ordinaires.
- Toujours donner un libellé lisible en plus du symbole ; pas d’information portée uniquement par la couleur.

## 2. Couleurs sémantiques (proposition, à intégrer dans la charte globale)

| Token | Hex proposé | Emploi |
|---|---|---|
| `offense` | `#FFB36D` | Attaque, critique, dégâts |
| `magic` | `#BC9AFF` | Mana, compétence, magie |
| `defense` | `#89D9C9` | PV, bouclier, soin |
| `control` | `#80C8FF` | Ralentissement, immobilisation |
| `economy` | `#FFD56C` | Or, relance |
| `premium` | `#F2B8FF` | Diamants et cosmétiques |
| `utility` | `#CAD1EA` | Cases, vagues, catégories |

Fond foncé (ex. `#17132A`), contraste texte suffisant ; l’état sélectionné doit ajouter forme + contour + libellé.

## 3. Conventions rédactionnelles

- Stat : `+12 % Vitesse d’attaque` ; une **variation de 10 points de pourcentage** de critique doit s’écrire `+10 pts Chance de critique` (ne pas écrire « +10 % de critique » si la base est une probabilité).
- État : `Ralentissement 25 % · 2 s` ; unités `s`, `PV`, `Mana`, `Or` ; chiffres localisés `fr-FR`.
- Mécanique : `2 projectiles`, `rebondit vers 2 cibles`, `toutes les 3 fusions`.
- Compétence : **Nom** · Type · Coût/charge · **effet** · durée/zone · conditions · limite boss si applicable.
- Conditions et limites expliquées, pas cachées : « uniquement sur Arcanistes », « une fois par vague », « sans rebond récursif ».
- Long texte limité au panneau de détails ; carte d’augment = titre + 1 bénéfice clair + éventuel coût/contrepartie.

## 4. Tooltips standardisés

### Gardiens

**Arcaniste d’Aurore (exemple non canonique)** · Aurore / Arcaniste · 2★  
⚔ **Attaque** : 2 projectiles.  
✦ **Orage** : après accumulation de Mana, frappe jusqu’à 10 cibles.  
✧ **Synergie Arcaniste (2 distincts)** : +20 % Vitesse d’attaque.  
*Détails* : calculs, ciblage, fréquence, limites, interactions.

### Augments

**Éclat précis** · Argent · Offense  
`[crit-chance]` **+10 pts Chance de critique** à tous vos gardiens.  
*Tooltip avancé* : attaques admissibles uniquement ; ne touche pas les dégâts sur la durée.

### Écran / canal

| Support | Texte affiché |
|---|---|
| Carte boutique | Nom + classe + famille + prix + rang |
| Fiche compacte en combat | Rang, PV/mana et 2–3 effets principaux |
| Fiche détail | Attaque, passif, compétence, synergies, calculs |
| Choix d’augment | Titre, rareté, bonus, limite / contrepartie |
| Ecran fin de vague | Gain d’or, nombre de fusions, événement marquant |

## 5. Navigation mobile et accessibilité

- Tap ouvre détails et permet une lecture complète ; hover n’est jamais requis.
- Icônes avec `aria-label` sur les boutons ; décoration SVG `aria-hidden="true"` seulement si un texte existe.
- Ne pas coder l’information dans l’animation seule ; prévoir un mode effets réduits et des contrastes testables.
- Contrôles explicites : glisser/poser pour déplacer, double sélection en alternative pour fusionner, « Retour » sans perte.
- Les étoiles ont toujours leur rang numérique : `3★` (accessible aux lecteurs d’écran via `aria-label`).

## 6. Contrat pour le développeur

Le rendu reçoit une description structurée : `keyword_id`, `value`, `unit`, `source_id`, `duration`, `target`. Il résout label, couleur et icône depuis le registre central. **Pas** de texte de tooltip dupliqué dans les classes de personnages, ni d’icônes embarquées au hasard dans les augments.

Les couleurs, formats et exemples restent des **propositions de design**, à valider sur téléphone réel.
