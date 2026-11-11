# META-05 — bilan assets et performances

## Octets et fidélité

| Planche | PNG source | PNG optimisé | Réduction |
|---|---:|---:|---:|
| Zones de sorts | 3 220 399 | 2 858 008 | 11,3 % |
| Gardiens secondaires | 2 628 604 | 2 327 504 | 11,5 % |
| Rangs Luma/Mousse/Raïka | 3 113 994 | 2 636 477 | 15,3 % |
| Gardiens principaux | 2 642 429 | 2 351 219 | 11,0 % |
| Projectiles | 2 504 634 | 2 105 554 | 15,9 % |
| Halos et piédestaux | 2 910 195 | 2 659 687 | 8,6 % |
| **Total** | **17 020 255** | **14 938 449** | **12,23 %** |

Les sources sont conservées et toutes les associations restent identiques. Le repli vers les originaux n’est demandé qu’en cas d’erreur ; aucune précharge des deux formats n’est ajoutée. La planche secondaire est conservée mais n’est pas chargée par les trois gardiens actuels.

## Méthode de mesure

La mesure ouvre directement la Collection dans un contexte froid 390×844, DPR 2, avec réduction des animations. Serveur HTTP localhost `no-store`, cache navigateur désactivé. Trois essais par variante et par profil, ordre alterné original/optimisé. La seule substitution de variante est l’URL d’art dans le même petit module intercepté des deux côtés ; les corps PNG transitent réellement par HTTP et le limiteur réseau. Les temps incluent le chargement des modules/catalogues et le décodage des images visibles, la disponibilité des polices et deux frames de composition.

Deux profils : local sans limitation, puis CDP réseau 4 Mbit/s/80 ms/1 Mbit/s et CPU ×4. Les valeurs ne sont ni un score Lighthouse ni une mesure Android/Safari physique. FCP mesure la première peinture de contenu, pas les portraits prêts. Les ressources, long tasks et heap JS sont enregistrés à titre diagnostique.

La Collection demande 8 057 258 octets d’images originales contre 7 116 460 octets optimisés, soit **940 798 octets / 11,68 %** économisés sur ce parcours. Le gain des six planches ne doit pas être attribué artificiellement à la seule Collection.

Campagne finale du 11 novembre 2026, Edge 157.0.4341.46, Node 24.2.0 / Playwright 1.65.0 sur Windows. Médianes de trois essais froids :

| Profil / variante | FCP | DOMContentLoaded | Illustrations prêtes | Octets images |
|---|---:|---:|---:|---:|
| Local / sources | 44 ms | 46,4 ms | 144 ms | 8 057 258 |
| Local / optimisé | 40 ms | 43,9 ms | 141,4 ms | 7 116 460 |
| 4 Mbit/s, 80 ms, CPU ×4 / sources | 396 ms | 610,2 ms | 17 050,7 ms | 8 057 258 |
| 4 Mbit/s, 80 ms, CPU ×4 / optimisé | 384 ms | 597,3 ms | 15 182,3 ms | 7 116 460 |

Sous limitation, le gain médian de disponibilité des illustrations est de **1 868,4 ms (~11 %)**, cohérent avec la réduction d’octets. En local, l’écart de quelques millisecondes est trop faible pour conclure à un gain temporel significatif. La mesure n’est pas un essai sur réseau radio réel. Trois essais desktop ne permettent pas d’affirmer un gain stable sur tous les téléphones.

**15,18 s d’attente des illustrations sous ce profil reste élevé.** Aucun budget produit n’est considéré approuvé : il faut reconsidérer les ressources nécessaires et mesurer sur téléphone avant bêta. Le texte apparaît beaucoup plus tôt, mais FCP ne prouve pas que le contenu du jeu soit prêt. Aucune long task n’a été observée dans ces 12 ouvertures ; cela ne qualifie ni un combat ni une interaction prolongée.

## Mémoire et suite d’optimisation

Une planche pleine taille 1122×1402×4 représente 6 292 176 octets RGBA (~6 MiB) ; les six totalisent **37 753 056 octets (~36 MiB)** avant textures, copies, DOM et moteur. La compression PNG ne diminue pas ce budget décodé. Des images à l’intérieur de sections repliées peuvent également être téléchargées : aucun chargement différé généralisé n’est revendiqué.

Le test de navigation répète 30 cycles de cinq écrans, revient à la même Collection et relève DOM/heap après GC aux cycles 0/10/20/30. Un DOM stable est un signal utile, pas une preuve d’absence de fuite mémoire totale. Les décodeurs, caches et GPU ne sont pas comptés dans le heap JS ; l’effet du moteur réel reste inconnu.

| Cycles / transitions cumulées | Nœuds DOM | Heap JS après GC |
|---|---:|---:|
| 0 / 0 | 149 | 1 765 620 octets |
| 10 / 50 | 149 | 2 497 116 octets |
| 20 / 100 | 149 | 2 521 140 octets |
| 30 / 150 | 149 | 2 527 968 octets |

Le heap augmente pendant l’échauffement et n’est donc pas déclaré constant ; l’écart entre les deux derniers points est de 6 828 octets. Une durée plus longue et les outils mémoire natifs restent nécessaires.

L’émulation d’insets top=47/bottom=34 produit un padding supérieur de 61 px et inférieur de 42 px, avec la navigation dans le viewport. C’est une validation de la formule CSS actuelle, pas d’une encoche réelle. La police de recherche mesurée est de **11 px** dans les deux moteurs : son comportement au focus Safari physique est un point de QA ouvert.

À décider ensuite selon mesures physiques : découpe en sprites/atlas réellement nécessaires, variantes de résolution ou chargement paresseux des études de rangs, budget GPU et ressources moteur. Ces changements demandent une preuve des coordonnées/FX et une revue graphique, sans remapper silencieusement le catalogue.

Pour un paquet embarqué, conserver sources et dérivés dans le dépôt ne signifie pas tout inclure dans le binaire. Embarquer les deux augmente le poids disque. La politique de repli et le manifeste d’inclusion doivent être définis avec le packaging retenu.

Les principes de zones sûres sont documentés par [WebKit](https://webkit.org/blog/7929/designing-websites-for-iphone-x/). Les mesures CDP sont des émulations de développement, via le [protocole Emulation](https://chromedevtools.github.io/devtools-protocol/tot/Emulation/), et ne remplacent pas les insets et contraintes matérielles réels.
