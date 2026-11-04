# ELEMENTAL TOWER

## Prototype v0.5 — Portrait mobile

Le fichier `index.html` est un prototype autonome (HTML/CSS/JavaScript), issu de la V0.4-B fournie pour ce correctif. Il fonctionne directement dans un navigateur mobile en mode **portrait** ; aucun build natif Android/iOS n'est encore inclus.

### Changements
- Terrain vertical (720 × 1000 unités logiques) : château démoniaque en haut, château du joueur en bas, routes gauche et droite.
- Interface adaptée aux téléphones : HUD supérieur, terrain central, commandes d'armée en bas, prise en compte des zones de sécurité et de la hauteur réelle des barres.
- Déplacement d'une tour vers une case vide par glisser-déposer ; les fusions sur une case occupée restent inchangées.
- Menu de construction adapté à la largeur du téléphone et libellés raccourcis.
- Règle d'orientation : portrait sur mobile, message de rotation uniquement en paysage sur les petits écrans.

### Tester
1. Ouvrir `index.html` dans Chrome, Firefox ou Safari (pour tester les APIs tactiles et le viewport, le servir depuis un serveur HTTP local ou un hébergement statique).
2. Construire deux tours Feu, déplacer l'une sur une case vide, puis la glisser sur l'autre pour obtenir une tour de rang 2.
3. Lancer une vague ; vérifier les routes, les dégâts et les boutons de classe/élément.
4. Vérifier le rendu sur 320×568, 375×667, 390×844 et 430×932, puis sur de vrais téléphones iOS/Android.

### Limites
- Prototype, non application native ni PWA installable.
- Équilibrage du combat conservé de la V0.4 ; un ajustement sera nécessaire, puisque la géométrie et les distances de déplacement changent.
- La réserve de fusion, la jauge de contre-attaque, les effets élémentaires supplémentaires et les achats intégrés ne sont **pas** implémentés dans cette PR.

Le dépôt `main` ne contenait initialement qu'un `README.md` : cette branche ajoute donc le prototype autonome complet, sans écraser de code de gameplay existant.
