# Elemental Tower — Meta Experience V1.0 (prototype interactif)

**Statut : revue produit/DA, non fusionné.** Cette version reprend le moteur jouable de `feat/playable-expedition-v09` et crée une expérience hors combat complète. Le fichier principal est [`prototypes/elemental_tower_meta_v10.html`](../prototypes/elemental_tower_meta_v10.html).

## Ce qui fonctionne effectivement

- Hub mobile portrait avec carte isométrique SVG, sélection des quatre lieux (seule Aurore ouvre un combat), objectif et prochain déblocage calculés depuis `profile`.
- Préparation → **vrai combat PvE de 12 vagues**, boss 4/8/12, augments pilotes après 5/10, retour au hub.
- Collection filtrable par famille/classe/statut : 9 gardiens du moteur (`UNITS`) et 5 déblocages gratuits selon `UNLOCK_MILESTONES` (2/4/6/8/10).
- Fiches interactives : compétences réellement présentes (`ROLE_KITS`), stats du moteur, six synergies (`TRAITS`), onglets Fusion, aperçu temporaire des rangs 1–5★.
- Laboratoire des six synergies et registre des dix augments effectivement implémentés (`PILOT_AUGMENTS`).
- Profil : XP, expéditions, victoires, meilleure vague et collection réellement enregistrés dans `localStorage` sous la clé V0.9 existante.
- Navigation et paramètres : Monde, Gardiens, Missions, Boutique, Profil, Synergies, Défis et Pass, boutons retour, sélection des régions, son et réduction des effets.

## Ce qui est seulement simulé pour la maquette

- Carte des chapitres Sylve, Sanctuaire des Flux et Crépuscule : prévisualisation non jouable.
- Missions quotidiennes/hebdomadaires : illustrations de la UX, suivi temporel et récompenses non implémentés.
- Boutique de packs cosmétiques, Pass saisonnier et classements : écrans de concept, **aucune transaction** et aucun faux adversaire.
- Niveau de profil affiché : conversion **indicative** de l'XP ; ce niveau n'existe pas en tant que mécanique validée.
- Tous les autres systèmes de compte/cloud, achats, matchs PvP et anti-triche restent hors du prototype.

## Direction artistique et ressources

- Référence importée du Google Drive partagé `ELEMENTAL_TOWER/Visuels/V2/pack_visuel.png` : [pack visuel V0.14](../assets/visuals/pack_visuel_v014.png). Les cartes du roster peuvent exploiter **8 portraits correspondants par nom** : Luma, Aéri, Solis, Mousse, Néma, Fougri, Nyx, Brume.
- Les assets de référence servent uniquement à l'affichage ; le moteur et les IDs restent ceux de la V0.9. En particulier, **Noctis n'a pas de portrait V0.14 correspondant** et conserve le SVG du prototype.
- Le pack V0.14 contient **15 concepts**, plusieurs familles/étiquettes différentes du prototype V0.9. Ne jamais traiter le visuel comme une mise à jour de statistiques ou de noms de classe sans revue avec le collègue.
- Le HTML peut fonctionner seul sans la référence externe ; dans ce cas, les gardiens sont affichés en SVG. Pour utiliser le visuel, ouvrir le fichier depuis la racine du dépôt téléchargé en conservant `assets/visuals/`.

## Invariants GDD respectés

1. Les gardiens, doctrines et déblocages compétitifs restent gratuits ; un skin ne donne pas de puissance.
2. L'or, les étoiles et les augments sont temporaires ; la collection est permanente.
3. Deux monnaies seulement (or de combat, diamants cosmétiques) ; pas de nouvelle devise persistante.
4. Aucun système de stamina, publicité forcée, lootbox payante ni classement sur score client non vérifié.
5. Le moteur du collègue n'est pas remplacé ; V0.8 et V0.9 existants sont inchangés. Cette version est un **fichier intégrateur séparé**.

## Critères d'acceptation de la maquette

- [x] Le nouveau fichier compile syntaxiquement en JavaScript.
- [x] Les IDs HTML sont uniques et les références DOM statiques résolvent des éléments présents.
- [x] Les neuf vues de produit et les quatre régions sont implémentées en code.
- [ ] Test de navigation au navigateur réel 320/390/430 px et encoches iOS/Android.
- [ ] Vérifier le premier combat complet sans assistance et le retour des déblocages dans la collection.
- [ ] Revue du collègue sur la correspondance V0.9 ↔ V0.14 des classes, familles et effets.
- [ ] Revoir les sprites provenant du pack (découpe, contraste et miniatures), puis livrer les vrais assets transparents définitifs.

## Ordre recommandé

1. Revue du hub et de la navigation sur téléphone.
2. Mapping validé du roster/DA et des déblocages.
3. Corrections UX collection et préparation.
4. Choisir les critères de mesure et instrumentation.
5. Seulement ensuite, produire les autres chapitres, missions réelles et services en ligne.

*Les divergences historiques du Mainbook (MVP paysage/offensive vs GDD portrait/auto-battler) restent ouvertes et ne sont pas arbitrairement résolues par cette maquette.*
