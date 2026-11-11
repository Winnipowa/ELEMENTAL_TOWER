# META-03 — Rapport de réalisation et validation

## Livraison et périmètre

Branche `feature/meta-03-collection-progression`, créée depuis `feature/meta-02-expedition-flow`, commit `8a8bdd9` de la PR #7. PR Draft empilée sur cette branche ; aucune fusion, aucun déploiement.

La collection, le codex et un système de progression persistante **de démonstration uniquement** sont implémentés indépendamment du moteur. Aucun fichier de gameplay du collègue ou identifiant canonique modifié. Les IDs `demo-*`, trois gardiens et quatre régions META-01 sont conservés. Aucun achat ou paiement.

## Fonctionnalités réalisées

- Catalogue versionné externalisé dans `meta/data/catalog.demo.json` : gardiens, descriptions, compétences illustratives sans statistiques, portraits, familles, classes, liens de codex, régions, chapitres et objectifs. Aucune donnée n’est présentée comme canonique.
- Chargement asynchrone validé, liste vide supportée, erreurs récupérables et absence de données optionnelles gérée. Tableaux et références invalides, versions inconnues et cycles de chapitres refusés.
- Collection : recherche, filtres famille/classe/état, fiches disponibles/verrouillées, portraits SVG locaux avec repli d’image absente, histoire fictive, compétence illustrative, condition de déblocage et synergies de codex.
- Codex : familles, classes et synergies issus du JSON ; aucun bonus ou mécanisme de combat inventé.
- Profil : nom éditable et sauvegardé, décompte collection/chapitres, graphe de deux chapitres et deux objectifs illustratifs. Les boutons « Valider manuellement · Démo » sont explicitement des outils de QA. Le premier débloque Nyx dans l’espace fictif et ouvre le second chapitre du profil ; ils ne prouvent aucun exploit de jeu. La carte conserve les statuts de région du catalogue.
- Sauvegarde locale V2, clé META dédiée, réouverture, migration en mémoire du format démo V1 documenté, sauvegarde explicite, relecture et réinitialisation confirmée. Aucune lecture/écriture des clés V0.9. Aucune devise, composition ou étoile persistée.
- Changement de catalogue : conservation des IDs connus, archivage des IDs retirés, aucun nouveau déblocage automatique ou restauration automatique d’un ID archivé.
- Données corrompues, source ou format inconnu : original conservé, écriture bloquée, diagnostic sur Profil ; aperçu initial fictif seulement. Stockage/quota indisponible : message d’échec et état enregistré inchangé. Conflit entre onglets : blocage et invitation à relire.
- Préparation META-02 alimentée par la collection fictive courante via réglage mock. L’orchestrateur de résultat n’importe pas le dépôt de progression : aucune victoire, défaite, récompense ou abandon fictif n’écrit dans la progression. Le test navigateur vérifie aussi une victoire après une sauvegarde et un déblocage manuel.
- Frontière de synchronisation proposée : métadonnées de provenance non fiable et réconciliation requise, `uploadAllowed:false`. Aucun serveur, transport, compte ou conversion de démo vers des droits réels implémenté.

## Architecture

`meta/catalog.js` charge et valide un catalogue externe. Le chargement peut être injecté dans MockGameBridge. `meta/progression.js` contient les transitions pures et le dépôt local injectable. L’interface projette les IDs débloqués sur les données de catalogue, sans réécrire les fixtures. `meta/expedition.js` reste inchangé et ne dépend pas de la progression.

`setDemoCollection` est une méthode exclusivement mock ; elle ne présume pas la signature du futur moteur. Le JSON exige actuellement `source:demonstration` : brancher le catalogue canonique demandera une revue du schéma et des frontières, pas de simplement rebaptiser des données de démo en données réelles.

Détail des formats, migrations et questions d’intégration : [META_03_CATALOG_HANDOFF.md](META_03_CATALOG_HANDOFF.md).

## Tests effectués

- `npm test` : **14 tests réussis**, dont les 9 tests META-02 préservés (chargement du catalogue adapté au fichier externe). Nouveaux tests : validation du JSON, références/duplicats/cycles, catalogue vide, repli des valeurs de portrait/palette ; sauvegarde/réouverture, dépendance des objectifs, idempotence, migration V1 sans écriture automatique, corruption/version future/source incorrecte, archivage lors de changement de catalogue, absence de nouveau déblocage automatique, quota, stockage bloqué, conflit d’onglet, reset limité à la clé META et métadonnées de synchronisation non autoritaire.
- `npm run test:ui` : **Edge headless, mobile tactile, 320/390/430 × 844 px**, suites META-01 et META-02 conservées. Une attente META-01 a été renforcée pour attendre les cartes après la lecture HTTP du JSON.
- META-03 aux trois largeurs : filtres classe/état, fiche verrouillée et codex ; modification du nom, validation manuelle d’objectif, persistance après rechargement et fiche déverrouillée ; victoire mock sans modification du stockage ; catalogue externe remplacé par une nouvelle version ajoutant un gardien initialement disponible, qui reste verrouillé pour la sauvegarde existante ; portrait manquant ; migration V1 et enregistrement V2 ; sauvegarde corrompue conservée malgré tentative d’écriture ; erreur HTTP puis reprise ; catalogue entièrement vide.
- Aucune erreur JavaScript observée. Débordement horizontal contrôlé par la suite META-01 et sur l’état vide META-03. Inspection visuelle de la collection 390 px et du profil 320 px : textes et actions lisibles, contenu long défilable, navigation basse persistante.
- Les captures finales sont dans `docs/screenshots/meta-03/` : collection, fiche verrouillée/déverrouillée, codex, profil, changement de catalogue et fallback portrait, erreur de sauvegarde, erreur réseau et catalogue vide, aux trois largeurs (**27 captures**).
- Les premiers essais ont corrigé des attentes de test : le chargement externe est asynchrone et un changement de fragment ne relit pas le JSON. La validation finale ci-dessus a été exécutée après ces corrections.

## Exécution

`npm ci` puis `npm start` ; ouvrir http://127.0.0.1:4173/meta/index.html. Le JSON nécessite un serveur HTTP local : ne pas ouvrir le HTML directement en file://. `npm test` lance les tests unitaires ; `npm run test:ui` démarre son propre serveur, exige Edge installé et le port 4173 libre. Les interceptions réseau des tests ne concernent que les fixtures de test.

## Limites et décisions à valider

1. **DA** : portraits/silhouettes et cadrages provisoires, repli d’image, présentation verrouillé/disponible, densité du profil/codex et noms/familles/classes. Aucun mapping V0.14 ↔ catalogue canonique validé.
2. **Produit** : chapitres, objectifs et déblocage manuel de Nyx sont des scénarios fictifs de test ; aucun contenu ou règle définitive. La progression locale n’est pas une progression de compte réel.
3. **Contrats techniques** : schéma JSON, versionnement, IDs retirés et migrations sémantiques, autorité des déblocages, synchronisation, conflits, catalogue canonique et API GameBridge à valider avec le collègue. La protection locale entre onglets est optimiste ; elle n’est pas une transaction serveur.
4. **Migration** : seul le format META démo V1 explicitement décrit est reconnu. Les anciens formats inconnus et versions futures sont préservés et non convertis arbitrairement. Aucun import de sauvegarde gameplay.
5. **QA restante** : téléphones physiques iOS/Android, Safari, encoches, lecteur d’écran, fermeture/reprise et multi-appareils. Le stockage peut être effacé par le navigateur ; pas de cloud ou garantie de durabilité serveur.
6. **Intégration** : reprendre la liste d’informations du document de raccordement avant de remplacer les fixtures ou de recevoir des résultats vérifiés. Aucun code local démo n’est autorité pour un classement ou une récompense serveur.

Les rapports META-01/02 restent des preuves historiques de leurs lots. META-03 ajoute la persistance de démo ; les résultats de session META-02 restent éphémères et sans effet sur cette persistance.
