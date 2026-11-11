# META-04 — Rapport fonctionnel

Branche `feature/meta-04-products-settings`, issue du commit `bf7524a` de la PR #14 ; PR Draft ciblant `feature/ux-01-game-interface`. **Prototype local, données fictives. Aucune fusion ni aucun déploiement.**

## Missions

Six entrées externes, réparties en quotidiennes/hebdomadaires/permanentes. Filtres par rythme et état ; objectifs, compteurs, conditions/prérequis et récompenses consultables. États disponible/en cours/terminée/verrouillée calculés depuis les marqueurs QA, jamais depuis une partie.

Progression modifiable exclusivement dans les contrôles **Missions et Pass · QA**, ajoutés à la section de démonstration existante. Les prérequis bloquent la simulation d’une mission verrouillée ; diminuer un prérequis réinitialise les marqueurs dépendants devenus incohérents. Toutes les récompenses pointent vers des concepts cosmétiques, sans réclamation ou attribution. Aucun reset calendaire ou compteur temporel réel.

## Boutique et Pass

- Catalogue cosmétique versionné de cinq concepts : apparence de gardien, effet de compétence, animation, décor et élément de profil. Filtres catégorie/disponibilité/recherche ; fiches avec illustration, description, statut d’aperçu et modale de prévisualisation fermable par Escape. Produit absent, recherche vide et illustration à fournir gérés. Aucun prix, transaction ou inventaire.
- Les aperçus réutilisent les références DA-03 : portrait Luma, FX de fleurs/étoiles et piédestal. Ils sont étiquetés comme références : **aucun nouveau skin jouable ni animation réalisée n’est revendiqué**. Un emplacement explicite est prévu pour les illustrations définitives.
- Pass de démonstration à trois paliers, deux voies consultables par boutons, récompenses exclusivement cosmétiques. Points et états verrouillé/disponible/obtenu sont fictifs. Seuls les outils QA peuvent modifier les points ou marquer un palier obtenu. Cela n’accorde aucun produit, droit premium ou progression META-03. Aucun achat, abonnement, expiration, minuterie ou activation réelle.

## Paramètres et sauvegarde

Réduction des animations, texte agrandi, contraste renforcé et effets de halos CSS. Les préférences sont appliquées à l’interface et mémorisées seulement lors d’une action explicite, sous **`elemental-tower.meta-preferences.v1`** (schéma 1, source demonstration). La réduction système des mouvements reste respectée. Les glows inclus dans les images originales ne sont pas retouchés.

Préférences corrompues/inconnues ou stockage inaccessible : original préservé, valeurs par défaut et écriture bloquée avec message. Quota/conflit d’onglet : échec explicite, pas de faux succès. Réinitialisation confirmée limitée à cette clé. Les réglages audio sont visibles mais désactivés, clairement sans effet tant qu’aucun moteur audio n’existe. Confidentialité et version du prototype consultables.

Les marqueurs QA Missions/Pass ne sont **pas persistés** : rechargement de page ou relecture des catalogues les réinitialise. Les préférences seules persistent dans leur nouvel espace. Les nouveaux modules ne lisent ni n’écrivent les clés V0.9 ou META-03 ; l’application conserve son fonctionnement META-03 préexistant.

## Architecture et frontières

- Trois JSON versionnés dans `meta/products/` : missions, cosmétiques, Pass. Aucun changement du catalogue META-03.
- `service.js` : validation et port de chargement injectable, modèle QA indépendant, métadonnées de contrat futur d’événements vérifiés.
- `screens.js` : vues/contrôles hors combat, filtres, navigation produit et emplacements d’illustration. `preferences.js` : dépôt distinct et application des préférences.
- Chargement des trois catalogues **atomique** pour contrôler les références de récompenses : un fichier invalide/indisponible donne un état d’erreur sur Missions/Boutique/Pass avec réessai. Les Paramètres et les systèmes META existants restent indépendants de ce chargement. Requêtes périmées ignorées après un nouveau chargement.
- Aucun import du moteur ou de GameBridge dans ces nouveaux modules. `meta/bridge.js`, `meta/expedition.js`, `meta/progression.js`, `meta/catalog.js`, le JSON META-03 et les assets/associations DA-03 restent inchangés.
- Les écrans de produits et Paramètres peuvent s’afficher indépendamment du chargement du catalogue de gardiens. La section QA générale conserve ses outils META préexistants.

## Tests et captures

- `npm test` : **26 tests réussis**, dont les 18 existants et huit couvrant validation/versions/références/cycles, récompenses cosmétiques, catalogue vide/transport, quatre états de mission, prérequis, appel non-QA refusé, statuts Pass/dédoublonnage/réduction de points, préférences persistées/isolées/corrompues/quota/conflit et requêtes obsolètes.
- `npm run test:ui` : suites META-01/02/03 et UX-01 conservées et réussies à 320/390/430 × 844 et contrôle UX 320 × 568. Les tests existants n’ont pas été modifiés pour ce lot.
- `npm run test:products` : nouveaux parcours complets à **320 × 844, 390 × 844, 430 × 844 et 320 × 568**. Conditions/récompenses, filtres mission/boutique, quatre états de mission après QA, deux voies du Pass, fiche/produit introuvable, aperçu modal, visuel absent, recherche vide, persistance des préférences, repli en cas de corruption, chargement suspendu, erreur HTTP/réessai et catalogues totalement vides.
- Une victoire mock après simulation QA laisse les compteurs de mission inchangés. Les tests comparent les sauvegardes protégées avant/après et excluent seulement la nouvelle clé de préférences lors de leurs changements explicites. Les marqueurs QA disparaissent au rechargement ; aucun produit n’est attribué.
- Contrôles visibles testés hors de la navigation basse, également sur Missions/Boutique/Pass avec texte agrandi ; pas de débordement horizontal ni erreur JavaScript observée sur ces scénarios.
- **72 captures**, dix-huit états aux quatre formats, et mesures dans `test-results/meta-04/`. Exemples de livraison dans `docs/screenshots/meta-04/`. Missions, Boutique, Pass premium 390 px et Paramètres/aperçu modal 320 × 568 inspectés visuellement. Captures du viewport : certains états montrent une position basse choisie par la mise au point, contenu restant défilable.

## Limites et validations

Les noms, objectifs, seuils, prérequis, contenus/paliers du Pass et concepts cosmétiques sont fictifs, pas définitifs. Les marqueurs « obtenu » ne sont pas des droits. Le garde-fou QA est un mécanisme de prototype côté client, pas une preuve de sécurité serveur.

À valider : saturation/lisibilité des cartes, statut aperçu vs possession, compréhension du Pass premium fictif, illustrations définitives, catégories et identité des produits. Aucun asset nouveau généré. Rendu et accessibilité à tester sur téléphones physiques iOS/Android, Safari, encoches, clavier virtuel, lecteurs d’écran, zoom système et faible luminosité. Les contrôles/contrastes renforcés ne constituent pas une certification d’accessibilité.

Les services de progression vérifiée, inventaire/droits, identité, horloge, audio, données canoniques et synchronisation restent à intégrer après accord. **Liste précise et contrats proposés : [META_04_INTEGRATION.md](META_04_INTEGRATION.md).** Le port de catalogue est remplaçable ; la progression serveur exigera un adaptateur autoritaire distinct du modèle QA, pas la réutilisation des commandes de simulation.

Lancer : `npm ci`, `npm start`, puis http://127.0.0.1:4173/meta/index.html. Les commandes navigateur démarrent leur propre serveur et requièrent Edge installé et le port 4173 libre. Ne pas les lancer simultanément.
