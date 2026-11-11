# PERF-01 — chargement des illustrations

Branche `feature/perf-01-lazy-illustrations`, créée depuis PR #17, commit `50329e3d9bf09602b821e79f42975967dc678c9b`. Référence `0.5.0-perf.1`. Le moteur, GameBridge/orchestrateur, contrats, données de gameplay, sauvegardes, préférences et CSS restent inchangés.

## Diagnostic et solution

META-05 livre des planches compressées sans perte, mais un petit portrait ou badge utilise encore une image 1122×1402 complète. Les images présentes dans les `<details>` fermés ont déjà un `href` et sont téléchargées. Les galeries du Codex et la Boutique préchargent aussi des portraits et FX hors du panneau visible. La planche secondaire n’est déjà pas utilisée par les trois gardiens actuels : sa suppression du trafic ne peut pas être comptée comme un gain PERF-01.

Cette passe conserve toutes les sources, planches META-05, coordonnées `GUARDIAN_ART`/`SHEETS`, viewBoxes et clips. Elle ajoute **24 PNG individuels**, générés à partir des rectangles réellement utilisés par les renderers. Chaque découpe inclut jusqu’à **24 pixels de marge** autour du rectangle, bornés par la planche, pour conserver les voisins utiles au rééchantillonnage. L’image découpée est replacée aux coordonnées absolues de cette marge ; le rectangle logique reste inchangé. Aucun redimensionnement, changement de palette, perte d’alpha, personnage ou mapping canonique inventé.

`npm run assets:sprites` utilise FFmpeg comme outil local, vérifie les SHA des sources et compare **tous** les octets RGBA de chaque découpe avec la zone correspondante de la source, transparence comprise. Le manifeste séparé `meta/art/sprites/provenance.json` conserve rectangle logique, rectangle physique, dimensions, poids, SHA PNG/RGBA et recette. Les sources et leur ancien manifeste ne sont pas modifiés.

### Chargement différé

Un SVG garde sa géométrie et son label dès le rendu, mais son `<image>` n’a aucun `href` tant qu’il n’est pas exposé. `IntersectionObserver` utilise le conteneur défilant courant, une marge de 0 px, et respecte les découpes des galeries et les panneaux fermés. Ouvrir un panneau ne charge que sa partie effectivement visible ; la suite arrive au défilement. Les badges et FX suivent la même règle que les portraits.

Une voie géométrique scroll/toggle/resize couvre l’absence d’IntersectionObserver. Chaque racine (écran ou aperçu modal) ne possède qu’un cycle actif ; le précédent observer et ses listeners sont supprimés à la nouvelle liaison. Une ancienne fiche détachée ne peut pas lancer ses évolutions après navigation. Une réouverture du même panneau déjà chargé ne réattribue pas les URLs. Aucun cache applicatif persistant ou changement de stockage n’est ajouté.

En cas d’échec d’un crop, une seule tentative vers la planche originale rétablit d’abord ses coordonnées/dimensions complètes. Si celle-ci échoue, le portrait conserve son libellé de repli existant. Ce mode dégradé peut donc consommer une planche entière ; les gains normaux ne s’appliquent pas à ce cas. Un rectangle futur absent de l’index garde une livraison de planche différée, en attendant régénération des découpes.

## Mesures et périmètre

La bibliothèque de 24 crops pèse **3 061 299 octets**, contre 14 938 449 pour les six planches META-05. Les cinq planches réellement utilisées représentent 12 610 945 octets ; les comparaisons par écran ci-dessous évitent de compter la sixième inutilisée comme trafic supprimé.

La charge RGBA nominale de tous les crops est de **7 112 816 octets**. Celle des cinq planches utilisées est de 31 460 880 octets. Il s’agit d’une estimation `largeur × hauteur × 4`, par fichier unique, pas de RAM de processus mesurée. Décodage partiel, cache navigateur, copies CPU/GPU, textures, buffers et filtres peuvent différer ; aucun FPS, RSS, budget thermique ou appareil physique n’est certifié.

### Méthode avant/après

Le mode avant intercepte les modules app/art/transport exacts de PR #17. Le mode après intercepte les mêmes URLs avec le code PERF-01. CSS, catalogues, stockage de fixtures et serveur restent communs ; les corps des images transitent réellement par HTTP local, ils ne sont pas injectés par un mock réseau.

Mesures Edge/Chromium sur Windows, contextes froids indépendants, cache désactivé, DPR 2, animations réduites, réseau CDP **4 Mbit/s descendants, 1 Mbit/s montant, latence 80 ms, CPU ×4**. La Collection est répétée trois fois par variante dans chacun des formats 320×844, 390×844, 430×844 et 320×568 ; les trois autres parcours à 390 px sont exploratoires, un essai par variante. L’ordre est alterné pour limiter le biais d’échauffement.

Le temps « illustrations visibles prêtes » attend le catalogue et les vrais composants, puis les images exposées chargées/décodées, les polices et deux frames de composition. Le titre seul ne suffit pas. Les octets et l’estimation RGBA sont relevés séparément une fois la vague réseau initiale terminée, afin de compter aussi les ressources cachées de la version avant. Les ressources terminées au moment du premier indicateur sont également conservées dans le JSON.

Un premier pilote attendait le titre déjà rendu pendant le chargement du catalogue ; ses temps ont été écartés et la garde des composants chargés ajoutée avant la campagne de référence. Les helpers de captures ont aussi été adaptés : ils attendent seulement les images visibles sans attribuer d’URL aux images différées. Ils ne doivent pas provoquer artificiellement un chargement hors écran.

Les résultats finaux, inventaire froid de 17 routes, ressources, temps, estimations et captures se trouvent dans les preuves de la mission. Ces mesures simulées ne sont **pas des résultats Android/iPhone physiques** ni une promesse de délai sur réseau radio réel.

[Accès aux preuves versionnées et aux exemples avant/après](audit/perf-01/README.md).

### Inventaire à froid à 390×844

Octets PNG de la vague initiale et RGBA nominal par image unique. G = gardiens principaux, H = halos/piédestaux, P = projectiles, A = zones de sorts, R = rangs ; ces lettres désignent les anciennes planches complètes. Le mode après utilise uniquement les crops exposés, aucune planche complète dans le parcours normal.

| Écran | Planches avant | Octets avant → après | RGBA estimé avant → après |
|---|---|---:|---:|
| Monde | — | 0 → 0 | 0 → 0 |
| Collection | G/H/P | 7 116 460 → 947 278 | 18 876 528 → 2 561 920 |
| Fiche Luma | G/H/P/A/R | 12 610 945 → 475 125 | 31 460 880 → 1 232 912 |
| Fiche Mousse | G/H/P/A/R | 12 610 945 → 540 244 | 31 460 880 → 1 302 368 |
| Fiche Nyx | G/H/P/A | 9 974 468 → 492 855 | 25 168 704 → 1 213 960 |
| Codex / Synergies | G/H/A | 7 868 914 → 1 253 041 | 18 876 528 → 2 987 832 |
| Missions | — | 0 → 0 | 0 → 0 |
| Boutique | G/H/A | 7 868 914 → 729 360 | 18 876 528 → 1 730 324 |
| Produit Éclat de Luma | G/H | 5 010 906 → 253 271 | 12 584 352 → 660 004 |
| Pass | — | 0 → 0 | 0 → 0 |
| Profil | — | 0 → 0 | 0 → 0 |
| Paramètres | — | 0 → 0 | 0 → 0 |
| Préparation | G/H | 5 010 906 → 532 099 | 12 584 352 → 1 335 432 |
| Session sans partie | — | 0 → 0 | 0 → 0 |
| Résultats sans partie | — | 0 → 0 | 0 → 0 |
| Défis | — | 0 → 0 | 0 → 0 |
| Outils de démonstration | — | 0 → 0 | 0 → 0 |

Les écrans de session/résultat à froid présentent leurs replis sans partie, pas un faux résultat réel ; le résultat mock actuel est également textuel. Le parcours de partie actif reste couvert par les suites META-02. Les vues sans PNG utilisent encore du texte/SVG/CSS, dont le coût n’est pas assimilé à zéro mémoire totale.

Le trafic PNG de la Collection baisse de **86,69 %**, son estimation RGBA de **86,43 %**. La fiche Luma baisse respectivement de **96,23 %** et **96,08 %**. Le nombre de fichiers peut augmenter (3 planches → 8 crops dans la Collection), mais leur surface et leur poids sont bien plus faibles. Les requêtes et leurs durées restent consignées pour mesurer ce compromis.

### Temps sous réseau limité

Collection : médianes de trois ouvertures froides par variante, dans la même campagne appariée. Les octets restent ceux de la vague initiale totale ; le temps correspond aux illustrations effectivement visibles.

| Collection | Avant | Après | Réduction | Octets PNG après | RGBA nominal après |
|---|---:|---:|---:|---:|---:|
| 320×844 | 15 079,0 ms | 2 717,7 ms | 82,0 % | 947 278 | 2 561 920 |
| 390×844 | 15 078,7 ms | 2 711,1 ms | 82,0 % | 947 278 | 2 561 920 |
| 430×844 | 15 085,9 ms | 2 713,8 ms | 82,0 % | 947 278 | 2 561 920 |
| 320×568 | 15 040,7 ms | 1 839,3 ms | 87,8 % | 532 099 | 1 335 432 |

Sur le petit viewport, moins de portraits/badges sont exposés : il charge quatre crops au lieu de huit. L’estimation RGBA avant est de 18 876 528 octets dans les quatre cas ; après, sa réduction atteint 92,9 % à 320×568.

| Autres écrans, 390×844 — exploratoire, un essai | Avant | Après |
|---|---:|---:|
| Fiche Luma | 26 029,2 ms | 1 733,1 ms |
| Codex / Synergies | 16 571,7 ms | 3 320,2 ms |
| Boutique | 16 568,2 ms | 2 245,5 ms |

La première peinture de contenu (FCP) reste distincte : sur la Collection 390×844, médiane 452 ms avant / 444 ms après. Un texte visible à 0,45 s ne signifie pas que les portraits sont prêts. Les autres écrans n’ayant qu’un essai par variante ne permettent pas de conclure à une variance ou une médiane stable. Aucun percentile ou résultat physique n’est extrapolé.

## Vérification et reproduction

Prérequis : Node 24+, Git/tar, historique contenant PR #17 et les commits DA/UX rejoués, Edge installé et runtime WebKit Playwright. Un clone superficiel doit récupérer cet historique. FFmpeg est nécessaire uniquement à la régénération, pas aux tests utilisant les crops déjà versionnés.

```sh
npm ci --ignore-scripts
# Prérequis de test : Edge et runtime WebKit Playwright installé.
npm run test:perf
# Régénération facultative des crops, avec FFmpeg installé :
npm run assets:sprites
```

`test:perf` enchaîne la campagne INT-01 héritée, la QA mobile META-05 adaptée aux images différées, les tests PERF-01 Edge/WebKit et le benchmark apparié. Il conserve les tests d’expédition, collection, produits, états vides/erreur et sauvegardes ; il ne lance aucun moteur réel. Les campagnes artistiques historiques restent rejouées sur leur révision d’origine.

La QA ajoutée couvre pixels RGBA des 24 crops dans chaque navigateur, portraits au défilement, évolutions fermées/ouvertes, réouverture sans requête, fiche détachée, aperçu modal, voie sans IntersectionObserver et invariance des rectangles visuels. Les captures avant/après comprennent Collection, les trois gardiens, Codex, Boutique, FX et début/fin des évolutions aux quatre formats. Les écarts de rastérisation A/A déjà observés dans META-05 empêchent de présenter un screenshot comme une certification pixel à pixel ; la preuve stricte porte sur les données RGBA et coordonnées, complétée par revue humaine des captures.

**Résultat final : `npm run test:perf` termine avec code 0**, ses quatre étapes réussissent : référence héritée (108,57 s), non-régression mobile (60,18 s), QA PERF-01 (53,74 s), benchmark (295,77 s). **31 tests unitaires**, aucun échec ni test ignoré ; les suites fonctionnelles et cinq replays artistiques historiques passent. La QA mobile héritée conserve ses 192 visites de routes, et l’audit INT-01 ses 96 visites sans moteur.

PERF-01 ajoute **48 comparaisons de pixels RGBA** (24 crops × deux moteurs, aucun écart), huit parcours de chargement différé (deux moteurs × quatre formats), deux essais sans IntersectionObserver, un inventaire à froid de 17 routes avant/après et 30 ouvertures limitées. Les rectangles et viewBoxes de 48 paires de vues sont identiques. **144 captures**, soit 72 paires avant/après, sont livrées. La régénération des 24 PNG/manifeste est déterministe dans l’environnement testé ; la reconstruction fonctionne aussi sans index généré préexistant.

Environnement : Windows, Node 24.2.0, npm 11.3.0, Playwright 1.65.0, Edge 157.0.4341.46 et WebKit Playwright 27.2 **Windows**. WebKit de test n’est pas Safari sur iPhone. Les seuils relatifs du benchmark (au moins 60 % de réduction des octets et du RGBA estimé, 40 % du temps simulé) passent pour les sept configurations mesurées ; ce sont des garde-fous de cette expérience, pas des SLA mobiles.

## Limites et validation humaine

- Les ressources déjà chargées ne sont pas expulsées à chaque scroll : cela évite clignotement et redécodage au retour. Le cache image du navigateur demeure sous son contrôle. L’estimation par écran froid n’est pas un pic mémoire de toute une session.
- Le déclenchement à la visibilité géométrique, sans marge de préchargement, peut laisser brièvement le fond du portrait visible pendant un défilement rapide sur réseau faible. L’anticipation éventuelle et son budget doivent être validés sur téléphone ; elle ne doit pas réintroduire les planches complètes.
- Aucun gain de performance du combat n’est revendiqué ; aucune intégration du moteur n’est réalisée.
- Sources et anciens dérivés restent au dépôt pour provenance/repli. Le futur paquet doit décider de leur inclusion ; conserver ces fichiers n’implique pas qu’il faille tous les embarquer.
- Revue humaine des halos, transparences, couleurs et contours au redimensionnement, puis essais réels Android/Safari : zoom/DPR, mémoire totale, arrière-plan et réseau faible. Aucun choix de catalogue ou de DA n’est revalidé implicitement.

Le mécanisme suit l’[API IntersectionObserver documentée par MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) et l’événement [toggle des détails](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details). Aucun SDK, analytics, framework mobile, déploiement ou publication n’est ajouté.
