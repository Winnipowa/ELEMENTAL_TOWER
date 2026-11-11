# ELEMENTAL TOWER — Chantier application (hors combat)

**Statut : cadrage, non fusionné.** Propriétaire du chantier : produit / UI / marketing avec Codex. Le collègue garde la propriété du gameplay, des gardiens, compétences, animations de combat, synergies et équilibrage.

## Objectif

Livrer une application mobile portrait, utilisable et testable **sans moteur de combat embarqué**, de façon à pouvoir brancher plus tard le gameplay canonique du collègue derrière un contrat explicite. Le contenu de `feature/meta-world-v10-full` (PR #4) et de `feature/meta-world-home-v09` (PR #3) sert de **référence visuelle/fonctionnelle**, pas de base à fusionner telle quelle : ces prototypes incluent ou dérivent d'un moteur PvE temporaire.

## Frontières de responsabilité

**Notre chantier :** flux de navigation, accueil et carte des régions, préparation et résultat (hors simulation de combat), collection et codex, progression et déblocages, profil/paramètres, boutique cosmétique et Pass (écrans sans achats réels au stade prototype), missions, social/défis (conceptuels), télémétrie, tests UX, assets marketing, ASO et pages de lancement.

**Chantier du collègue :** règles et boucle de combat, unités et IDs canoniques, familles/classes, stats/skills/traits, fusion 1–5★ pendant le run, animations, calcul des résultats et équilibrage. Les schémas d'échange et l'intégration finale sont validés **ensemble**.

**Règles produit héritées du GDD V1.1 :**
- Portrait mobile ; fantasy cute + dark ; stratégie et synergies ; un doigt.
- Collection et doctrines débloquées de manière durable ; or combat, étoiles et composition réinitialisés entre runs.
- Deux devises seulement : or temporaire et diamants persistants pour cosmétiques/Pass.
- Aucun achat de puissance ou unité, aucune pub forcée, aucune stamina bloquante.
- PvP avec les gardiens/doctrines réellement débloqués par le joueur. Aucun classement non vérifié côté serveur.

## Lots d'exécution (ne pas construire tout en une fois)

### META-01 — Coquille d'application mobile (P0)
- Navigation claire : Accueil/Monde, Collection, Missions, Boutique, Profil ; accès contextuel à Préparation, Résultats, Synergies, Pass, Défis et Paramètres.
- États UI chargement/vide/verrouillé/erreur ; retour, modales, safe areas, accessibilité tactile.
- Mode démo local qui ne dépend d'aucun fichier de gameplay ni réseau ; entrées visuellement distinguées comme données de démonstration.
- Livraison : prototype navigable et screenshots 320, 390, 430 px, aucune régression du code existant.

### META-02 — Monde, préparation, retour du combat (P0)
- Carte/régions et progression illustrative, un seul chapitre réellement sélectionnable dans les tests.
- Préparation avec objectif, sélection de région et bouton « Lancer » connecté à une **interface simulée** `GameBridge`, jamais à un clone du moteur.
- Retour via `RunResult` simulé : victoire/défaite, vague atteinte, durée, prochain objectif ; aucune récompense accordée sans source explicite.
- Livraison : boucle navigation `monde → préparation → connecteur fictif → résultats → monde`.

### META-03 — Collection/codex/profil/état (P0/P1)
- Grille, filtres, fiche unité, compétences et synergies **alimentés par un catalogue versionné fourni par le collègue**, avec jeu de données mock provisoire clairement identifié.
- États déverrouillé/verrouillé et conditions ; pas de statistiques inventées présentées comme canoniques.
- Schéma de sauvegarde méta local pour tests avec version et migration ; ne pas écraser la clé `localStorage` de V0.9 ; futur backend distinct.
- Aucun déblocage permanent calculé depuis une victoire non vérifiée lorsque les comptes serveur existeront.

### META-04 — Produits hors gameplay (P1)
- Missions et défis : maquettes honnêtes tant que les services ne sont pas implémentés.
- Boutique cosmétique et Pass : catalogues de présentation, sans paiement réel, faux stock, faux adversaires, faux classements ou faux compte à rebours.
- Paramètres, confidentialité, accessibilité et tutoriel de navigation.
- Connexion/identité, sauvegarde cloud, achats natifs et social réels **hors périmètre initial** : spécifier avant d'implémenter.

### META-05 — QA, mesure et préparation marketing (P1/P2)
- QA téléphone réel iOS/Android ; formats 320/390/430 px, encoches, fermeture/reprise, navigation et affichage états vides.
- Définir les événements : `app_open`, `onboarding_complete`, `collection_view`, `expedition_prepare`, `expedition_start`, `expedition_result`, `skin_preview` (pas d'événement payé tant qu'aucun achat).
- Préparer identité, captures store issues d'un build réel, landing, kit presse, courtes vidéos gameplay **réel** dès réception du moteur, ASO, test créatif, tracking des canaux.
- Ne pas faire de publicité montrant de fausses mécaniques, de faux combats ou de faux taux de récompense.

## Critères de passage

1. UI méta fonctionnelle même lorsque le connecteur de jeu est absent.
2. Aucun import direct ou copie d'un prototype moteur dans les modules méta.
3. Échanges de données documentés dans `docs/GAME_BRIDGE_CONTRACT_V0.md` et validés par le collègue avant intégration.
4. Tests manuels sur téléphone et preuve de navigation avant revue de fusion.
5. Une PR par lot logique, sans fusion ni déploiement de production sans approbation.

## Sources et points non tranchés

- Références : `docs/GDD_V1.1.md`, `docs/HANDOFF_COLLEGUE_2026-11-04.md`, `docs/PLAN_EXECUTION_P0_P2.md`.
- Prototypes visuels : PR #3 et #4 ; ils ne sont pas des preuves d'implémentation définitive.
- Le mapping visuel V0.14 ↔ IDs moteur reste à arbitrer ; ne pas renommer des gardiens dans le code du collègue.
- Framework final (HTML de prototype ou application native/hybride), système d'identité et API du moteur : **à confirmer**, aucune décision technique irréversible ici.
