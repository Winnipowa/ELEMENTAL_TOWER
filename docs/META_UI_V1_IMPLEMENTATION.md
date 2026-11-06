# Elemental Tower — Meta UI V1.0 (prototype navigateur)

Date : 2026-11-06. Branche : `feature/meta-world-home-v09`.

## Ouvrir

Ouvrir `prototypes/elemental_tower_tft_pve_v09_meta.html` localement dans un navigateur moderne : fichier HTML autonome (icônes de `assets/ui/system-icons.svg` embarquées), sans compilation ni dépendance réseau. Compatible avec navigateur mobile en portrait. Aucun build natif iOS/Android n'est produit.

## Ce qui fonctionne dans le code

| Écran | Interaction réelle | Données |
| --- | --- | --- |
| Accueil | sélectionner quatre régions, changer l'objectif, ouvrir la fiche de région et préparer la partie | Régions : propositions UI, Aurore jouable |
| Préparation | informations sur l'expédition, démarrage et atelier libre | moteur V0.8 : 6 vagues, 9 gardiens, fusion 1–5★ |
| Collection | filtres famille/classe, détail individuel, onglets capacités/synergies/évolution/apparences | objet `UNITS` et `TRAITS` dans la même page, pas de pseudo gardiens débloqués |
| Missions | filtres quotidien/hebdomadaire, progression et statuts | scénarios UX, calculés avec des records locaux, sans reset calendaire ni gains |
| Boutique | packs thématiques, fiches concept, Pass à cinq paliers de présentation | données illustratives, pas de prix ni de paiement |
| Défis | règles et record personnel, état de classement non encore connecté | aucun adversaire ou score inventé |
| Profil | parties, victoires, record, dernière fusion, succès observables | `localStorage` sur l'appareil |
| Réglages | audio activé/désactivé, rappel du respect des préférences de mouvement | logique audio V0.8 |
| Résultats | affiche le résultat, incrémente le record, retour accueil | résultat PvE V0.8 ; aucune attribution économique permanente |

## Sources utilisées

- `docs/GDD_V1.1.md` : promesse produit, objectifs, règles de monétisation, progression, PvP collection personnelle.
- `docs/systems/SYSTEM_GLOSSARY.md`, `docs/systems/UI_KEYWORDS_STYLEGUIDE.md`, `game-data/systems/keywords.json` : vocabulaire, couleurs sémantiques et icônes.
- `assets/ui/system-icons.svg` : 29 symboles SVG embarqués, identifiants préfixés pour éviter les collisions.
- `prototypes/elemental_tower_tft_pve_v08.html` : source de vérité technique actuellement implémentée pour neuf gardiens, leurs familles, leurs classes, leurs statistiques et le combat.
- Questionnaire produit du 06/11/2026 (35 décisions) et annexe Product & Meta Design du MAINBOOK partagé.

## Données de démonstration : ne pas confondre avec production

- La carte isométrique est reconstruite en SVG, sans assets finales de paysage ni vrai niveau de déplacement libre.
- Trois chapitres fictifs pour chaque région sont proposés pour visualiser la structure. Seule Aurore est reliée à une expédition réelle.
- Les « missions » ne sont pas un mécanisme de backend, ni un système de tâches calendaires, ni une source de monnaie.
- Le Pass présente cinq niveaux exemples (le GDD évoque vingt niveaux, à valider) ; aucun droit premium n'est créé.
- Les skins, packs, événements, classements et profils externes sont non connectés.
- Les visuels des gardiens en SVG sont ceux du prototype V0.8, pas les nouveaux sprites approuvés des références d'art.
- Les paramètres de compétition (seuil des six gardiens, matchmaking) restent des propositions ; aucun PvP implémenté.

## Checklist de revue sur appareils réels

1. Ouvrir la page à 320, 360, 390 et 430 px de largeur et avec encoche simulée ; vérifier les boutons de région, la carte et le panneau d'objectif.
2. Ouvrir / fermer tous les panneaux, vérifier que leur contenu peut défiler et que le bouton retour reste accessible.
3. Filtrer les neuf gardiens, lire les quatre onglets de chaque fiche ; comparer les prix, familles, classes et rôles aux données `UNITS` / `TRAITS`.
4. Parcours : accueil → Aurore → préparation → combat → victoire/défaite → résultats → menu ; vérifier la progression de record local.
5. Vérifier qu'une sélection Sylve/Flux/Ombres ne lance pas une fausse expédition.
6. Tester la boutique et le Pass : aucune interaction ne doit débiter une monnaie ni déclencher un achat.
7. Recharger la page et vérifier la conservation des records locaux ; tester en navigation privée et sans `localStorage` disponible.
8. Tester la navigation au clavier, la réduction des animations et l'audio.
9. Vérifier sur un navigateur réel que les icônes SVG embarquées et les gardiens s'affichent correctement.

## Contrat de livraison

Ce prototype est un **hub interactif de préproduction**, pas une application mobile native déployée, et pas une intégration à un backend. Les fonctionnalités manquantes sont annoncées plutôt que simulées comme réelles. Le moteur existant n'a pas été réécrit. Aucune PR ne doit être fusionnée sans revue et test manuel sur appareil.
