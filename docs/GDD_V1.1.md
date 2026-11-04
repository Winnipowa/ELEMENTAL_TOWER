# ELEMENTAL TOWER — Game Design Document (GDD) V1.1

**Version :** 1.1 · collection personnelle en PvP · 4 novembre 2026  
**Statut :** décisions produit validées + paramètres provisoires de test. Aucun résultat de rétention, de matchmaking ou de rentabilité n’est encore démontré.  
**Répartition :** direction produit/UX/économie/mesure ici ; gardiens, familles, classes, attaques, effets, silhouettes et équilibrage des unités traités par le collègue. Les interfaces entre ces chantiers doivent rester synchronisées.

## 0. Légende des décisions

- **ACTÉ** : décision explicitement retenue au cours de nos échanges.
- **PROPOSÉ** : valeur ou système défini ici pour éviter les questions inutiles ; modifiable après essais.
- **À TESTER** : hypothèse dont l'intérêt n'est pas démontré.
- **ARBITRAGE EXPLICITE** : décision stratégique du porteur du projet ; ne pas la remplacer par une suggestion par défaut.

## 1. Promesse, cible, identité

**ACTÉ :** jeu mobile en portrait, free-to-play, fantasy « cute + dark », gardiens lisibles, démons noirs/violets, effets magiques violet/bleu/rose. Fusion de 1★ à 5★. Famille + classe (ex. Aurore/Arcaniste), recrutement de type auto-battler et vagues PvE. Déblocages durables ; étoiles réinitialisées à chaque expédition. Pas de publicité externe obligatoire ni de système d'énergie bloquant au lancement. Deux monnaies : or et diamants.

**Promesse produit PROPOSÉE :** « Recrute des gardiens, fusionne-les et compose des synergies spectaculaires pour repousser les démons. Chaque expédition te pousse à inventer une meilleure stratégie. »

**Différenciation à prouver :** non pas seulement « TFT + Tower Defense », mais *des compétences qui interagissent selon la composition ET le placement sur un chemin d'invasion*. Une synergie doit changer un comportement (rebonds, gel + éclairs, protection de ligne), pas seulement ajouter 10 % de dégâts. Ce design relève du chantier gardiens/synergies avec le collègue.

**Cible initiale PROPOSÉE :** joueurs mobiles de stratégie accessibles (collection, combats auto et fusions), qui apprécient les sessions de 10–15 min. Pas de revendication démographique sans recherche utilisateur.

## 2. Boucle de jeu principale

**Méta :** accueil → carte de région → expédition → récompenses/déblocage → prochain défi.

**Dans une expédition :**
1. Phase préparation : voir le prochain type de vague, acheter l'une des 3 offres, réorganiser sa réserve/terrain et fusionner ; les choix sont tactiles et lisibles.
2. Phase combat : les unités attaquent automatiquement ; mana/skills, effets et synergies sont visibles et compréhensibles.
3. Fin de vague : gagner de l'or de combat, renouveler les offres ; annoncer clairement le prochain défi.
4. Boss final : gagner ou perdre ; bilan court, récompenses et « prochain objectif ».

**PROPOSÉ pour le premier vrai test :** 12 vagues sur une région, boss aux vagues 4, 8 et 12, durée cible 10–15 min. Vague préparée par le joueur, avec lancement manuel anticipé possible, mais pas de pression à démarrer pendant le tutoriel. Ces chiffres ne sont pas équilibrés ; à ajuster via données.

**Variante longue future :** mode « siège sans fin » pour les joueurs qui veulent tenter le rang 5★ et maximiser leur composition. Ne pas développer avant la validation de la boucle de 12 vagues.

## 3. Recrutement, fusions, espace

**ACTÉ dans la direction :** une boutique d'offres en bas, terrain et réserve distincts, fusion de deux unités identiques de rang égal, progression jusqu'à 5★ ; revente. Le prototype V0.8 contient déjà 9 gardiens (3 familles × 3 classes), 8 cases de terrain, 5 cases de réserve, 3 offres et une revente à 60 %.

**PROPOSÉ pour la V1 test :** conserver provisoirement 8 cases terrain + 5 réserve, 3 offres, reroll en or combat. Déplacement et échange de positions sans coût ; fusion automatique seulement avec validation claire du joueur (ou geste explicite). Revente à 60 % du coût réellement investi, confirmée si le joueur touche une unité de haut rang. Boutiques qui ne bloquent pas sur réserve pleine : le joueur peut réorganiser avant d'acheter.

**Mathématique importante :** si fusion 2+2 à chaque rang, atteindre 5★ exige 16 copies d'un même gardien 1★. Avec 9 gardiens disponibles et 3 cartes affichées par boutique, ce cap est probablement très rare sur une courte expédition sans mécanismes d'orientation de la boutique. **À TESTER** : accès régulier à 2–3★, 4★ comme objectif ambitieux, 5★ comme pic de progression tardive/longue. Ne pas garantir le 5★ dans les 12 vagues sans tester les probabilités. Ne pas vendre de copies ni de rerolls contre diamants.

**À instrumenter :** rang maximal par partie, part des joueurs ayant atteint 2★ / 3★ / 4★ / 5★, or restant, invendus, réserve pleine, nombre de reventes, temps passé en préparation, fréquence des échecs de fusion.

## 4. Collection et déblocages permanents

**ACTÉ :** les gardiens, familles et doctrines se débloquent durablement ; les étoiles et l'or de combat reviennent à zéro à chaque nouvelle expédition.

**PROPOSÉ :**
- Chapitre I : territoire d'Aurore, formation au recrutement, une première classe et première synergie ; dévoiler les autres gardiens très tôt.
- Chapitre II : Sylve et mécanismes de contrôle/placement.
- Chapitre III : Crépuscule et synergies plus complexes.
- Après les premières victoires : « doctrines », choix stratégique pré-expédition (ex. contrôle, économie de combat ou offensive), sans boost permanent de stats ; leur impact nécessite validation avec le collègue.
- Lore très bref : dialogue de 1–3 lignes, récompense visuelle, portrait de gardien ou extrait de carte. Toujours ignorable et consultable dans un codex.

**Règle de conception :** les déblocages introduisent de nouvelles options ; ils ne doivent pas rendre les anciennes expéditions trivialement faciles par progression numérique permanente.

**PROPOSÉ :** progression de compte par XP *non monétaire* et succès, distincte de l'or/diamants. L'XP du profil peut servir au suivi narratif ; ne pas en faire une troisième devise échangeable.

## 5. Rythme de découverte et rétention

| Horizon | Ce que l'on apprend | Motif de retour | Validation |
|---|---|---|---|
| 0–10 min | Achat, placement, première fusion, skill | Première victoire + première récompense | Le tutoriel est compris sans long texte |
| J1 | Une famille, deux rôles, un premier boss | Prochaine synergie | Rejoue volontairement une expédition |
| J2–J7 | Autres familles et nouveaux défis | Découverte + collection | Revient sans énergie artificielle |
| S2–S4 | Compteurs, placement, doctrines et contre-jeu | Optimiser des compositions | Plusieurs builds viables |
| M2+ | Défis entre amis et classements | Reconnaissance / rivalité | Participation spontanée aux défis |

**À TESTER** : missions quotidiennes très légères (1–3 objectifs), défis hebdomadaires et succès de collection. Pas de pénalité de streak ou accumulation obligatoire. Le joueur doit pouvoir revenir après une pause sans être puni.

## 6. PvP et social — collection personnelle (ACTÉ)

### 6.1. Contrat de design

**ARBITRAGE EXPLICITE, 04/11/2026 :** un joueur utilise **uniquement les gardiens et les doctrines réellement débloqués sur son compte** en PvP. Aucun catalogue compétitif complet n'est prêté automatiquement. Les déblocages permanents font donc partie de la progression et de la stratégie.

**Principes communs :**
- Les gardiens débloqués sont permanents ; les étoiles repartent à 1★, la composition et l'or sont réinitialisés à chaque match.
- Aucun équipement, niveau de gardien, skin, Pass ou achat en diamants ne modifie les stats en compétition.
- Chaque gardien jouable et chaque doctrine doivent rester déblocables gratuitement, par des objectifs déterministes de PvE/lore ; **pas de verrou payant, pas d'aléatoire payant**.
- Les synergies et compositions ont des contres ; débloquer davantage de gardiens ajoute des **options**, pas des multiplicateurs permanents de dégâts.
- Les conditions d'un défi sont affichées clairement : carte, vagues, règles, collection personnelle admissible et mode de comparaison.

**Limite assumée :** le PvP à collection personnelle ne peut pas être parfaitement symétrique. Le matchmaking et les restrictions de puissance compensent partiellement les différences, mais ne doivent jamais être présentés comme une égalité absolue.

### 6.2. Progression et accès au PvP

**PROPOSÉ — ouverture du PvP :** après le tutoriel et **six gardiens permanents**, avec au moins deux familles et deux classes représentées et au moins deux synergies potentielles. Les six unités initiales doivent être obtenables gratuitement en peu de temps ; l'accès ne dépend pas d'un paiement.

**Pourquoi ce seuil :** ouvrir dès deux ou trois gardiens imposerait trop de compositions contraintes ; attendre la collection complète priverait les premiers déblocages de valeur sociale. Le seuil de six est une hypothèse UX, à vérifier pendant les tests.

**PROPOSÉ — modes :**
1. **Défi d'expédition asynchrone (V1 social)** : deux joueurs reçoivent le même terrain, les mêmes vagues, les mêmes ressources de départ et paramètres économiques. Chacun compose sa défense **avec sa propre collection** ; la boutique tire donc parmi des ensembles éligibles différents. Classement sur vagues franchies, puis points de vie restants, puis durée, avec règles de départage publiées. Un même scénario est rejouable uniquement dans une limite annoncée pour les classements, afin d'éviter le spam de tentatives.
2. **Défis entre amis (V1.1)** : partage d'un code/URL de défi, profil, composition finale et score ; ne nécessite pas de connexion simultanée.
3. **Match classé asynchrone (après validation)** : matchmaking tenant compte de la collection et du niveau de jeu ; classement saisonnier.
4. **PvP en temps réel/coop (hypothèse future)** : développement conditionné à la rétention et à une base de joueurs suffisante.

**Nuance d'équité importante :** partager la même graine de carte et de vagues ne garantit PAS des tirages de boutique identiques si les catalogues sont différents. Documenter cet écart au lieu de prétendre que le défi est strictement miroir. Pour le MVP, le même générateur pseudo-aléatoire, les mêmes prix et les mêmes règles de tirage sont utilisés, mais chaque tirage s'effectue sur le roster autorisé du joueur ; cela rend le résultat *reproductible*, pas parfaitement comparable.

### 6.3. Matchmaking protégeant les petites collections (PROPOSÉ)

Ordre de priorité :
1. **Éligibilité** : accès au mode, version du jeu compatible, règles du défi.
2. **Proximité de collection** : nombre de gardiens débloqués, diversité des familles/classes, doctrines autorisées. Ne pas se contenter d'un simple nombre : six gardiens avec trois synergies possibles ne valent pas six gardiens sans synergie.
3. **Niveau de jeu** : estimation de compétence issue des résultats précédents, distincte de la taille de collection. Les nouveaux joueurs ont un classement provisoire.
4. **Qualité de la comparaison** : éviter les adversaires hors de portée ; si aucune comparaison suffisamment juste n'existe, proposer un **défi non classé** ou un défi d'expédition prédéfini plutôt que d'inventer un adversaire humain.

**Garde-fous de conception :**
- L'indice de collection est calculé à partir de **tous les déblocages permanents du compte**, pas uniquement du deck choisi ; sinon les joueurs peuvent manipuler le matchmaking en masquant des unités.
- Le rang du joueur et sa collection restent deux axes indépendants. Ne pas compenser un déséquilibre de contenu en donnant des dégâts secrets à l'un des joueurs.
- Ne pas verrouiller de récompenses d'importance stratégique derrière la victoire PvP ; les récompenses classées restent des titres, décorations et cosmétiques.
- Si les populations sont faibles, préférer les défis asynchrones et une fenêtre de recherche large mais explicite, au lieu de faire patienter pour un duel en direct.
- **Aucun classement classé sans vérification côté serveur** du résultat, de la progression admissible et des paramètres du match. Un journal de décisions ou une simulation déterministe est préférable à un score fourni uniquement par le navigateur.

**À TESTER :** les seuils d'écart de collection, la pertinence du score de diversité, les temps de matchmaking, le taux de victoires par taille de collection et la part de matchs considérés inéquitables par les utilisateurs. Le seuil de six unités, les écarts admissibles et les classements ne sont pas validés par des données.

### 6.4. Équilibrage systémique

**Contrat gardiens avec le collègue :** aucune nouvelle famille ne doit être strictement supérieure aux anciennes ; pour chaque gardien ajouté, identifier son rôle, sa faiblesse, ses contres, ses synergies et les pools de collection où il apparaît. Les premières familles doivent pouvoir vaincre de vrais défis sans être rendues obsolètes. L'ajout d'un gardien impose un test sur petits et grands catalogues.

**Critère de surveillance PROPOSÉ :** segmenter les taux de victoire par différence de collection, familles disponibles et estimation de niveau de jeu ; investiguer toute divergence durable. Ne pas interpréter les tout premiers matchs comme un résultat statistiquement probant.

### 6.5. Valeur sociale

Partager une composition de fin de partie, son record, une victoire contre un boss, son profil cosmétique ou un défi avec code. Les visuels doivent être spectaculaires et lisibles sans révéler d'information privée. Amis, profils et partage peuvent précéder les rangs compétitifs.


## 7. Économie : strictement deux monnaies

**Or :** uniquement monnaie de **combat**, initialisée à chaque expédition ; permet achats, rerolls et choix tactiques ; jamais vendu directement. On peut le gagner pendant les vagues et aux victoires de round ; les montants restent à équilibrer.

**Diamants :** monnaie **premium persistante**, achetée en euros via paiements natifs iOS/Android ; permet skins, animations, terrains et éventuellement Pass. Ne donne aucune puissance ou tentative supplémentaire dans les classements. Les offres et montants doivent être transparents.

**PROPOSÉ pour un prototype de boutique :** 100 diamants/0,99 €, 550/4,99 €, 800/6,99 €, 1 200/9,99 € ; montants illustratifs à confirmer selon taxes, pays et stores. Exemples de prix : effets simples 200–400 diamants, skins gardiens 500–900, arènes 800–1 200. On ne doit pas simuler des prix « équivalents € » trompeurs : afficher les deux clairement si pertinent.

**IMPORTANT :** « or bonus », « copies de gardiens » ou « +20 % dégâts » via Pass compromettraient aussi l’équité des collections personnelles. Ils sont exclus des achats et des récompenses premium. L’or reste uniquement une ressource de partie ; les diamants ne débloquent ni gardien ni doctrine.

## 8. Monétisation et Pass

**ACTÉ :** produits cosmétiques, Pass et promotion **interne au jeu** ; pas de publicités externes obligatoires au lancement. Aucun système d'énergie artificiel bloquant.

**PROPOSÉ Pass de saison :** durée 30 jours à tester (une saison plus longue pourrait être économiquement plus raisonnable au démarrage), 20 niveaux, une voie gratuite et une premium. Récompenses : apparences, couleurs, effets de fusion, animation d'ultime, décor de château, avatar/cadre/titre, essais temporaires de skins clairement signalés ; essais n'affectant pas les performances.

**EXP ×2 :** uniquement pour l’XP du Pass (progression vers les récompenses cosmétiques) si vendu comme avantage ; **pas d’XP ×2 pour débloquer les gardiens ou doctrines utilisés en PvP**. Ne pas introduire un multiplicateur d'or de combat payant. Le Pass n'est pas nécessaire pour finir le contenu PvE.

**Promotion interne douce :** après la première grande fusion, aperçu du skin correspondant ; un essai gratuit sur 2–3 combats ; écran boutique accessible sans interrompre la partie ; récompense premium descriptive (sans compte à rebours mensonger). Produit permanent clairement distingué d'un essai temporaire.

**Séquence V1 :** 1) parcours gratuit complet ; 2) trois skins testables, une offre fondatrice ; 3) mettre en vente seulement après mesure d'intérêt ; 4) Pass saisonnier uniquement si l'équipe peut alimenter le contenu.

**Risques :** conversion incertaine et coût d'acquisition potentiellement supérieur au revenu. Mesurer revenus nets après commission, taux de conversion, acheteurs mensuels, ARPDAU/ARPPU, LTV et coût de production des cosmétiques. Aucun revenu n'est garanti.

## 9. UI/UX et onboarding

**ACTÉ :** mobile portrait, sans gros bloc d'introduction ; tutoriel contextuel : placer → défendre → fusionner → gagner. Terrain central et boutique/bench lisibles.

**Écrans nécessaires :**
1. Accueil / « Reprendre l'expédition » + carte.
2. Écran expédition (terrain, synergies lisibles, boutique d'offres, réserve, aperçu prochaine vague, bouton démarrer).
3. Résultats (victoire/défaite, meilleur rang, composition, récompenses, réessayer).
4. Collection/codex (portrait, famille, classe, skills, skins, aperçu 1–5★).
5. Carte de monde et écran chapitre/lore.
6. Boutique de diamants et boutique cosmétique, fiche du Pass.
7. Profil social et défis (à activer plus tard).
8. Réglages, confidentialité et contrôle du son.

**Critères UX :** interaction à un doigt, grandes zones tactiles, pas d'info importante uniquement au survol, tutoriel sautable, mode pause pendant préparation, effets spectaculaires mais lisibilité prioritaire ; test iOS/Android réel, 320–430 px et appareils avec encoches/zones de sécurité.

## 10. Production : prototype unique, tâches et responsabilités

| Priorité | Mission | Livrable / critère de réussite | Responsable |
|---|---|---|---|
| P0 | Figurer une expédition de 12 vagues | Victoire/défaite + boss + résultat + rejouer, sans écran bloquant | Produit → collègue implémente |
| P0 | Préparation / fusions / réserve / revente | Aucune perte involontaire d'unité, même quand la réserve est pleine | Produit + collègue |
| P0 | Identifier 3 builds distincts | Trois approches de combat visibles et jouables | Collègue (skills) + produit (tests) |
| P0 | Tutoriel tactile en contexte | Un néophyte gagne/comprend la première vague sans explication orale | Produit UX → collègue implémente |
| P0 | Résultats de partie et télémétrie | Instrumenter départ, abandon, fusion, synergie, vague, victoire/défaite | Produit/tech |
| P1 | Chapitre I et premier déblocage | Récompense persistante réellement conservée après relance | Produit → collègue implémente |
| P1 | Collection / codex | Voir les gardiens débloqués, ceux à découvrir et leurs compétences | Produit UX → collègue intègre |
| P1 | Test utilisateur sans monétisation | Mesurer compréhension, première victoire et envie de rejouer | Produit |
| P2 | Interface boutique cosmétiques | Essai skin + fiche achat, sans impact stats | Produit/tech |
| P2 | Pass fictif (non payant) | Compréhension des récompenses et intérêt mesuré | Produit |
| P2 | Défis asynchrones avec roster personnel | Même carte/vagues/budget, chaque joueur recrute dans sa collection, résultat vérifiable ; comparer les écarts de roster | Tech/produit |
| P3 | Achats intégrés natifs et conformité | Transactions vérifiées serveur, restaurations, mentions, politique | Tech/produit |
| P3 | Acquisition et store | Positionnement, vidéo courte du combo signature, page store | Produit/marketing |

**Ne pas construire maintenant :** guildes, PvP temps réel, coop temps réel, saisons multiples, douze familles supplémentaires, système d'énergie, loot boxes payantes, transactions de puissance, multiples monnaies persistantes.

## 11. Critères de validation / métriques

**Instrumentation minimum :** `tutorial_start`, `tutorial_end`, `expedition_start`, `wave_start`, `unit_bought`, `unit_moved`, `unit_fused`, `unit_sold`, `synergy_activated`, `skill_cast`, `expedition_end`, `skin_preview`, `store_open`, `purchase_start`, `purchase_success` ; propriétés : version, type de gardien, rang, durée, résultat, vague, source entrée, données pseudonymisées.

**Cibles initiales de travail (non benchmarks) :**
- ≥ 80 % des 10 premiers testeurs comprennent le premier placement sans intervention.
- ≥ 70 % des premiers testeurs terminent le tutoriel.
- ≥ 50 % veulent volontairement relancer une partie après leur premier résultat (question + observation, pas un KPI de rétention).
- Au moins 3 compositions procurent des chemins de victoire différents dans les tests internes.
- Taux d'abandon par vague et blocage de réserve surveillés ; toute frustration récurrente devient priorité P0.

**Avant un soft launch :** vérifier rétention J1/J7 à l'aide de cohortes significatives, satisfaction de combat, crash-free sessions, sessions par joueur, part d'expéditions achevées et intérêt cosmétique. Aucune de ces données n'est disponible aujourd'hui.

## 12. Risques / arbitrages

1. **5★ inaccessible :** règle des 16 exemplaires ; éviter de promettre l'ultime aux premières expéditions sans mécanique d'accès.
2. **Équilibre neuf gardiens :** si le jeu a très peu d'options, les synergies se résolvent vite ; tester la profondeur avant d'ajouter 50 unités.
3. **Blocage de réserve :** ne pas faire disparaître une offre payée ; faciliter échanges, fusions, revente clairement valorisée.
4. **Pass et power creep :** distinguer XP de Pass, XP de profil et monnaie de combat.
5. **PvP et collection personnelle :** collections asymétriques ⇒ risque de déséquilibre réel. Contrer par déblocages rapides et gratuits, match selon collection + compétence, suivi des taux de victoire ; ne jamais promettre une égalité parfaite.
6. **Coût de production cosmétique :** le prix d'un skin doit tenir compte de son animation, de ses états 1–5★ et de sa maintenance.
7. **Accessibilité :** une interface fantasy « premium » ne doit pas rendre le combat illisible sur un téléphone d'entrée de gamme.

## 13. Registre des décisions — validé / proposé / à observer

| Sujet | État | Règle opérationnelle |
|---|---|---|
| PvP limité à sa collection de gardiens/doctrines | **ACTÉ** | Ne pas prêter le catalogue complet ; utiliser les déblocages permanents du compte. |
| Pas de vente de puissance | **ACTÉ** | Diamants = cosmétiques/Pass ; aucun boost de combat, copie ou unlock compétitif achetable. |
| Progression A | **ACTÉ** | Déblocages persistants ; étoiles et or combat remis à zéro par expédition. |
| Défis asynchrones en premier | **PROPOSÉ** | Première couche sociale sans contrainte de population simultanée. |
| Seuil de 6 gardiens pour PvP | **À TESTER** | Une première collection permet au moins deux synergies ; ne pas compliquer l'accès. |
| Matchmaking basé sur collection + compétence | **PROPOSÉ** | Comparaison imparfaite, instrumentation indispensable. |
| 12 vagues, boss 4/8/12, 8 cases + 5 réserve | **PROPOSÉ** | Hypothèses de prototype, à équilibrer sur la V0.8. |
| Règles précises de score et délais | **À TESTER** | Suivre l'équité et l'exploitabilité. |

**Aucun nouvel aval nécessaire pour produire les prototypes et les plans de tests.** Les mécanismes qui changeraient le principe de collection personnelle ou permettraient de payer pour gagner nécessiteraient un arbitrage ultérieur, non supposé acquis.

## 14. Prochaine tranche de production : boucle complète PvE → collection → défi

### 14.1. Vertical slice P0 — une expédition qui a une fin

- **Entrée :** un chapitre sélectionnable depuis l'accueil, état initial clair, or de combat initialisé, cinq? Non : **huit emplacements terrain, cinq réserve et trois offres** (valeurs actuelles du prototype, provisoires).
- **Déroulement :** douze vagues, pause/préparation entre vagues, informations sur prochaine vague, boss aux 4/8/12, résultat victoire/défaite, relance.
- **Économie de partie :** or de combat gagné uniquement pendant la partie, utilisé pour recruter et relancer ; revente à 60 % de l'investissement ; pas de diamants utilisés en combat.
- **Fusions :** deux unités identiques de même rang vers la suivante ; déplacement/échange gratuit ; réserve saturée gérée sans perte silencieuse.
- **Sortie :** écran court expliquant la cause de la victoire/défaite (boss, plus grande étoile, composition, synergies actives) et annonçant **un seul prochain objectif**.
- **Passage au méta-jeu :** récompense de chapitre ou exploit enregistré dans une sauvegarde persistante ; le joueur peut retrouver ce déblocage dans le codex après fermeture/réouverture.

**Critère de réussite :** nouvelle partie jouable de bout en bout, progression sauvegardée, aucune action indispensable derrière une publicité ou un achat. Le prototype actuel V0.8 n'est pas supposé implémenter ces éléments tant qu'ils n'ont pas été codés et testés.

### 14.2. Vertical slice P1 — collection durable et premier défi social

- **Collection :** `guardian_id`, `unlocked_at`, `unlock_source`; aucun niveau payant de puissance, possibilité de voir les gardiens verrouillés et leurs objectifs PvE.
- **Doctrines :** `doctrine_id`, règles de déblocage, état verrouillé/déverrouillé ; règles d'équilibrage fournies par le chantier de gardiens.
- **Profil :** pseudonyme facultatif, avatar/cosmétique, progrès chapitre, records d'expédition et historique minimal d'essais.
- **Défi :** identifiant de scénario, version du catalogue, graine/paramètres des vagues, joueur A/B, roster débloqué au moment du défi, résultat validé, score et éventuelle expiration.
- **Comparaison :** mêmes paramètres PvE de départ mais boutiques restreintes à la collection propre à chaque joueur ; afficher « collections différentes » si nécessaire.
- **Sécurité :** l'état du client n'est jamais source unique de vérité pour les résultats classés. Pas de transfert de diamants, d'or ou de gardiens entre comptes.

**Critère de réussite :** deux comptes avec des collections distinctes peuvent terminer le même défi sans voir ni recruter un gardien verrouillé, et le score n'est pas accepté sans validation serveur.

### 14.3. Interfaces de travail entre les deux responsables

| Réalisation produit (notre côté) | Réalisation contenu/combat (collègue) | Contrat partagé |
|---|---|---|
| Parcours J1→J7, chapitre, conditions de déblocage | Catalogue de gardiens, classes/familles, compétences | Identifiants stables, coûts, classes/familles, tags de synergie |
| Économie de l'or, offres, réserve, limites de fusion | Dégâts, mana, cadences, effets | Gardiens viables à 1★ ; aucune unité indispensable achetable |
| Définitions défi PvP, score, match et profils | Contres, synergies et contre-jeu | Scénarios reproductibles, versions de balance immuables par match |
| Boutique cosmétique, Pass, habillage UI | États visuels du gardien 1★→5★ | Skins et effets ne modifient pas hitbox/statistiques/lisibilité essentielle |
| Tutoriel, instrumentation et QA | Feedback visuel et mécanique des sorts | Événements de fusion, skill, activation de synergie et dégât détaillés |

### 14.4. Mesures pour éviter les décisions à l'intuition

**Expédition :** taux de victoire par vague, composition, fusion maximale, % d'achats/reventes, réserve pleine, durée réelle, abandon et relance volontaire.

**Déblocages :** temps réel nécessaire pour obtenir 6 puis 9 gardiens, fréquence de chaque famille, joueurs sans composition viable, abandon après un nouveau déblocage.

**PvP :** comparaison des winrates à compétence estimée similaire selon écart de gardiens, diversité familiale, nombre de doctrines, taux de matchmaking impossible et perception déclarée d'injustice.

**Économie cosmétique :** vues d'aperçu, essais temporaires, ajouts panier, achats réels vérifiés, revenus nets et retour des utilisateurs ; pas de paywall dans le tutoriel.

## 15. Ordre de priorité et règles de non-dérapage

**Étape A (maintenant) :** spécifier et implémenter le premier chapitre de bout en bout, sans ajouter de familles au-delà du catalogue minimum déjà prévu. Valider que la progression permanente survit à une réouverture du jeu.

**Étape B :** démontrer que deux ou trois compositions différentes permettent de gagner le même chapitre et que les 5★ ont une trajectoire réaliste (ou annoncer qu'ils sont réservés au mode long).

**Étape C :** ajouter la comparaison de scores et le partage de défi non classé ; tester les différences de collection.

**Étape D :** classements vérifiés côté serveur, puis boutique cosmétique réelle et Pass uniquement après intérêt confirmé.

**Hors périmètre jusqu'à validation :** matchmaking temps réel, guildes, serveur de simulation complet si le défi non classé ne convainc pas, pubs externes, énergie bloquante, vente de gardiens, progression payante d'accès au PvP.