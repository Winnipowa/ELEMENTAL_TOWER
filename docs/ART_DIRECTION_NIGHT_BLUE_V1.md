# ELEMENTAL TOWER — DA-01 : Bleu nuit & couleurs élémentaires

**Statut : direction validée au niveau conceptuel le 11 novembre 2026.** Les valeurs hexadécimales, proportions et applications ci-dessous sont une **proposition opérationnelle à vérifier visuellement**, pas une validation finale des captures ou des assets.

## Intentions

Le méta-jeu mobile utilise **le bleu nuit profond comme dominante**. Les touches chromatiques **élémentaires** identifient familles, gardiens, synergies, récompenses visuelles et états narratifs. La composition reste lisible, élégante et stratégique, fantasy « cute + dark » ; éviter le rendu néon/cyberpunk, l'effet casino et les aplats violets omniprésents.

Le code de la PR #8 est actuellement majoritairement violet/mauve (voir \`meta/shell.css\`). Le remplacer par un système de tokens, sans changer le moteur du collègue ni inventer des catégories d'éléments canoniques.

## Palette initiale proposée (tokens)

| Token conceptuel | HEX | Usage |
|---|---|---|
| \`--bg-night\` | \`#0B1428\` | fond principal |
| \`--bg-deep\` | \`#081021\` | profondeur / zones hors cartes |
| \`--surface-1\` | \`#15243E\` | panneaux, nav, cartes |
| \`--surface-2\` | \`#1C304C\` | blocs surélevés et états actifs |
| \`--border-soft\` | \`#344A6C\` | séparateurs discrets |
| \`--text-primary\` | \`#F2F6FF\` | titres et valeurs |
| \`--text-muted\` | \`#B6C8DE\` | textes secondaires |
| \`--focus\` | \`#91E9F2\` | focus et navigation clavier |
| \`--action-primary\` | \`#51BFF2\` | bouton principal ; texte très sombre |
| \`--fire\` | \`#FF7856\` | accents feu |
| \`--water\` | \`#51BFF2\` | accents eau |
| \`--nature\` | \`#76D9A0\` | accents nature |
| \`--air\` | \`#C39AFF\` | accents air / magique si prévu |
| \`--lightning\` | \`#FFD66D\` | accents foudre |
| \`--ice\` | \`#91E9F2\` | accents glace |

**Ces catégories sont uniquement des étiquettes de direction artistique :** elles ne créent pas de nouvelles familles/classes/synergies de gameplay. Le mapping final dépend exclusivement du catalogue canonique du collègue.

## Règles de composition

1. Proportion indicative : environ 80 % surfaces bleu nuit, 15 % surfaces secondaires et texte, 5 % accents élémentaires. L'objectif est une composition contenue, pas un quota mesuré.
2. Une carte de gardien peut recevoir **une couleur d'élément**, localisée sur bordure, icône, halo, zone de portrait ou jauge. Ne pas colorer le fond de toute la page suivant le gardien.
3. Une seule couleur d'action principale par écran, le bleu eau clair par défaut. Une couleur d'élément est un **code d'information**, pas automatiquement un CTA.
4. Dégradés et halos : subtils, derrière les illustrations ou les récompenses. Pas de bruit visuel, pas de texte sur halo saturé, pas d'effet néon permanent.
5. Le verrouillage d'un gardien se lit par cadenas, texte et contraste, pas seulement par désaturation. Idem pour sélection, danger, succès ou catégories.
6. Garder les grandes zones tactiles, les safe areas, le focus clavier, et tester les contrastes des petites étiquettes. Pour les textes usuels viser WCAG AA : contraste >=4.5:1 ; grandes typographies >=3:1.
7. Pas d'animation requise pour comprendre une action ; respecter \`prefers-reduced-motion\`.
8. Préserver lisibilité des fiches, espacement, hiérarchie des résultats et navigation à 320/390/430 px.

## Application par écran

- **Monde :** fond nuit, îles/chapitres lisibles, éclairage léger localisé selon biome ; carte non systématiquement violette.
- **Collection :** grille nocturne avec portraits sur panneaux sombres, fin liséré élémentaire, badges de famille/classe cohérents, état verrouillé clairement distingué.
- **Fiche gardien :** illustration prioritaire, halo couleur élémentaire discret, textes de compétence neutralisés visuellement.
- **Préparation :** CTA eau clair et rappel de région ; ne pas inventer d'informations de gameplay.
- **Résultats :** bleu nuit maintenu, mise en scène plus lumineuse de victoire et plus sobre de défaite, sans faire passer des fixtures pour des gains réels.
- **Missions/Profil :** neutres et lisibles, accent rare réservé aux étapes ou succès réellement justifiés.
- **Boutique/Pass :** concept seulement, pas de fausse vente ; pas de contraste agressif ou faux sentiment d'urgence.

## Architecture CSS visée

- Définir des tokens sémantiques dans \`meta/shell.css\` ou un fichier tokens dédié et les réutiliser sur tous les écrans.
- Bannir les couleurs violettes codées directement en dur dans chaque composant ; n'utiliser le violet ponctuellement que pour un élément qui le demande.
- Ne jamais faire dépendre les couleurs du schéma de save ; la présentation des éléments se fait via un mapping visuel versionné et réversible.
- Préserver le fallback neutre si l'élément canonique n'est pas encore fourni.
- Aucun changement de données de démo, de \`GameBridge\`, de progression ou de combat pour une passe purement visuelle.

## Validation requise avant fusion

- Captures comparables **avant/après** sur Monde, Collection, fiche gardien, Préparation, Résultats, Boutique et Profil à 320, 390, 430 px.
- Exécuter \`npm test\` et \`npm run test:ui\` sans régression ; contrôler overflow, clics, modales et états vides/erreur/verrouillés.
- Soumettre la nouvelle DA à revue humaine : profondeur du bleu, intensité des accents, lisibilité, qualité fantasy/cute et absence de dérive violette.
- QA sur Safari/iOS et téléphone Android réel reste ouverte ; les captures navigateur ne la remplacent pas.
- Ne pas modifier le code canonique du collègue, fusionner, publier ni déployer sans approbation.
