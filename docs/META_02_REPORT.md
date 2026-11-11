# META-02 — Parcours d’expédition de démonstration

## Livraison

Branche de développement : `feature/meta-02-expedition-flow`, issue du commit `8d45fe6` de la PR #6 (`feature/meta-01-mobile-shell`). La PR Draft cible cette branche META-01, pas main. Aucun moteur ou fichier de gameplay modifié, aucune fusion, aucun déploiement.

Le parcours est Monde → Préparation → GameBridge fictif → Résultats → Monde. Les composants, navigation, fixtures, carte, styles et écrans META-01 sont conservés.

### Préparation

Aurore est le seul chapitre disponible. La fiche affiche l’objectif, le catalogue versionné et les gardiens admissibles débloqués. Aucun gardien verrouillé ni doctrine fictive n’est envoyé. L’utilisateur choisit un scénario clairement étiqueté « démonstration » : victoire, défaite, abandon, erreur de connexion ou erreur à l’ouverture. Ce sélecteur configure exclusivement l’adaptateur mock ; il ne fait pas partie du StartRunRequest proposé au moteur.

### Connecteur et fin de session

MockGameBridge vérifie région, version, roster et doctrine ; crée un identifiant de session et accepte son ouverture. L’écran du connecteur annonce explicitement qu’aucun combat n’est exécuté. Le bouton de résultat émet une fixture prédéfinie. Un bouton permet aussi d’abandonner ; quitter le connecteur par navigation ou historique produit un abandon. Les doubles lancements et doubles résultats sont protégés. Les résultats étrangers à la session active sont ignorés.

Les erreurs de lancement et d’ouverture restent visibles en préparation, sans résultat fabriqué. L’utilisateur peut sélectionner un scénario valide et réessayer. Le contrôle d’absence de moteur de META-01 reste disponible et explique que seul le connecteur fictif est présent.

### Résultats

Victoire, défaite ou abandon, région, nombre de vagues franchies, durée, session, version, composition non simulée, absence de récompense et prochain objectif illustratif. Les valeurs sont explicitement fictives : 12 vagues / 630 secondes pour victoire, 7 / 380 pour défaite, 0 / 0 pour abandon. Ces fixtures ne mesurent pas le temps passé dans l’interface et ne définissent pas l’équilibrage.

Liens vers Monde et nouvelle préparation. Les résultats existent uniquement dans la mémoire de la page : recharger affiche l’état sans résultat. Aucun déblocage, record, diamant, sauvegarde V0.9 ou PlayerMetaState n’est écrit. Le catalogue est cloné ; earnedUnlocks est vide. Il n’existe aucun chemin d’attribution de récompense dans ce lot.

## Architecture et contrat à valider

- `meta/bridge.js` : adaptateur mock et fixtures META-01 conservées ; cycle start/open/subscribe/stop proposé dans GAME_BRIDGE_CONTRACT_V0.
- `meta/expedition.js` : orchestration injectable (`ExpeditionSession`), états idle/starting/running/completed/error, corrélation au runId et désinscription. Aucun accès DOM ou stockage. Elle accepte uniquement des résultats mock dans ce lot.
- `meta/app.js` : réutilisation des vues META-01 et présentation des trois étapes.
- `configureDemo` et `completeDemo` sont des extensions exclusivement mock. Le futur adaptateur ne doit pas être contraint de les implémenter : les contrôles de simulation seront remplacés au point d’intégration.
- Aucun RealGameBridge supposé ou moteur canonique importé. Le montage est volontairement opaque (null dans la démo). Il faut valider ensemble le type de mountTarget, les méthodes et événements exacts, les IDs, versions, données de composition et récompenses, l’autorité de vérification, l’annulation, la reprise et les erreurs.
- Avant un moteur réel : élargir la validation des payloads et statuts local/server après accord, définir la gestion des courses d’annulation et du démontage réel, les délais de connexion et la politique de reprise. Le comportement de sortie immédiate de la démo n’est pas une règle de gameplay définitive.

## Tests exécutés et preuves

`npm test` : 9 tests réussis. Catalogue isolé ; requête absente refusée ; trois issues de session, émission unique et catalogue inchangé ; région verrouillée, gardien verrouillé, roster vide, version et doctrine invalides refusés ; erreurs start/open et reprise ; double lancement et désinscription ; résultats étrangers, non mock et doublons ignorés.

`npm run test:ui` : Edge headless, mobile tactile, 320/390/430 × 844 px. Les parcours META-01 restent exécutés (14 routes, retours, modales, catalogue vide/erreur/reprise, recherche vide). Ajout des cinq scénarios d’expédition par largeur, reprise après chaque erreur, abandon par historique et résultat effacé au rechargement. Les trois largeurs passent sans erreur JavaScript observée. Débordement horizontal vérifié sur les routes META-01 et les résultats META-02.

Un témoin localStorage est posé par le test : tous les scénarios et le rechargement laissent l’ensemble du stockage identique. Les tests unitaires comparent aussi le catalogue avant/après. Les tests ne prétendent pas valider une progression backend inexistante.

Captures : `docs/screenshots/meta-02/` contient préparation, connecteur, résultats des trois issues et erreurs aux trois largeurs. Elles sont générées par le test sous `test-results/meta02-*.png` puis copiées pour revue. Résultat victoire 320px inspecté visuellement : texte et actions lisibles avec défilement, navigation inférieure fixe.

## Démarrage et limites

`npm ci`, puis `npm start` ; ouvrir http://127.0.0.1:4173/meta/index.html. `npm run test:ui` démarre son propre serveur sur le port 4173 et nécessite Edge installé ; arrêter un serveur déjà actif avant ce test.

À valider explicitement :

1. **Direction artistique** : carte et silhouettes provisoires META-01, hiérarchie du bilan, lisibilité des mentions Démonstration et placement des contrôles de revue. Aucun asset définitif ajouté ou mapping visuel/canonique supposé.
2. **GameBridge** : tous les points de contrat ci-dessus, avec le collègue, avant toute intégration réelle.
3. **UX sur appareil réel** : Safari/iOS, Android physique, encoches, lecteur d’écran, fermeture/reprise et défilement tactile. Les captures headless ne remplacent pas cette validation.
4. **Produit** : objectifs, libellés de chapitres et chiffres de fixtures ne sont pas définitifs ; pas de simulation de composition, synergie ou combat.

Les rapports META-01 restent des preuves historiques de ce lot ; META-02 remplace uniquement son indisponibilité de session par un connecteur simulé explicite.

