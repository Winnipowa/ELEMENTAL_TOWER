# META-03 — Catalogue, codex et raccordement futur

**Proposition technique de démonstration, non validée comme contrat canonique.** Aucun identifiant du collègue n’est renommé ou remplacé. Les trois IDs `demo-*` et les libellés existants de META-01 sont conservés.

## Source externe

`meta/data/catalog.demo.json` contient toutes les entrées de catalogue. `loadCatalog()` lit le fichier local via HTTP dans le navigateur (sans CDN ni backend), valide puis clone ses données. Le chargeur est injectable dans MockGameBridge. Aucun catalogue n’est réécrit dans l’interface.

Enveloppe actuelle : `schemaVersion: 1`, `source: demonstration`, `catalogVersion`, `rulesetVersion`, puis tableaux `guardians`, `regions`, `families`, `classes`, `synergies`, `chapters`, `objectives`. Les tableaux peuvent être vides. La validation rejette IDs dupliqués, références pendantes, cycles de chapitres, versions et sources inconnues. Un catalogue invalide donne une erreur récupérable, sans écriture de sauvegarde.

Gardiens : `id`, `name`, `familyId`, `classId`, `traitIds[]`, `unlocked` (état initial de la fixture uniquement), `portraitKey?`, `color?`, `description?`, `abilitySummary?`, `unlockHint?`. Champs de présentation optionnels : texte de repli si absent. Portraits locaux `meta/portraits/<portraitKey>.svg`, clé simple uniquement ; pas de HTML/SVG arbitraire injecté depuis le JSON. Image absente : symbole de repli. Palette invalide : valeur de repli. Toutes les chaînes du catalogue sont échappées avant affichage.

Chapitres : `id`, `title`, `regionId`, `requiresChapterId?`, `objectiveIds[]`. Objectifs : `id`, `title`, `description?`, `unlockGuardianIds[]`. La complétion des objectifs détermine les chapitres terminés et la disponibilité des suivants. Le statut de région sur la carte reste défini par le catalogue : aucun accès à un nouveau combat n’est fabriqué.

## Sauvegarde de démonstration

Clé unique : `elemental-tower.meta-demo.v2`. Aucune lecture, migration, suppression ou écriture des clés V0.9. Schéma V2 : source demonstration, version catalogue, révision locale, nom de profil, IDs gardiens débloqués, objectifs complétés, IDs retirés archivés. Pas d’or, étoiles, composition, inventaire premium, résultat de combat ou devise.

Ancien format **META démo V1 uniquement** : `{schemaVersion:1, source:'demonstration', catalogVersion, unlockedGuardianIds:[], completedObjectiveIds:[]}` sous cette même clé. Il est migré en mémoire ; aucune écriture automatique. Le bouton Enregistrer conserve explicitement la migration. Ce format ne représente aucune sauvegarde V0.9 connue.

Une sauvegarde corrompue, inconnue ou issue d’une autre source reste intacte et bloque les écritures. Le profil affiche le diagnostic ; les données initiales sont alors un aperçu fictif non restauré. Réinitialisation possible uniquement par action explicite confirmée et limitée à la clé META. Stockage inaccessible ou quota : message d’échec, sans faux succès ni mutation de l’état enregistré. Révision et comparaison de la valeur relue évitent d’écraser une modification d’un autre onglet (protection optimiste locale, pas une transaction multi-appareils).

Changement de catalogue : IDs encore présents conservés, IDs retirés archivés et exclus de la collection active. Aucun déblocage initial nouvellement ajouté n’est accordé aux sauvegardes existantes. IDs archivés non réactivés automatiquement. Les significations des IDs et migrations sémantiques restent à convenir ; une version de catalogue seule n’est pas une preuve de compatibilité de règles.

## Frontière de synchronisation proposée

`DemoProgression` reçoit un stockage injectable ; ses opérations sont lecture, sauvegarde, validation manuelle d’objectif et réinitialisation. `syncPreview()` décrit uniquement la provenance `demonstration`, l’autorité `untrusted-local`, la version et la révision, avec `uploadAllowed: false` et réconciliation requise. Aucun HTTP serveur, compte, authentification, file d’attente ou synchronisation exécutée.

Une future implémentation devra traiter l’état serveur comme autorité et séparer son espace de données de la démo. Aucun résultat mock ni déblocage démo ne doit être converti automatiquement en droit serveur. Le contrat à discuter inclura révision distante, conflits, idempotence des événements vérifiés, migrations et politique hors ligne. Ce document ne définit ni endpoint ni structure finale de moteur.

## Informations à obtenir du collègue

1. Enveloppe/version du catalogue canonique et format de transport ; disponibilité locale/hors ligne, cycle de mise à jour et compatibilité des versions de règles.
2. IDs stables des gardiens, familles, classes, traits/synergies et doctrines ; politique de retrait, renommage et remplacement ; ne pas dériver les IDs de leurs noms affichés.
3. Noms localisables, descriptions de codex et compétences autorisées, champs facultatifs, unités et signification des éventuelles statistiques. Aucune statistique n’a été inventée ici.
4. Portraits individuels validés : clés, formats, cadrage, fallback et mapping V0.14 ↔ IDs. Les silhouettes de cette livraison restent des placeholders.
5. Graphe réel des chapitres/objectifs, collection initiale, conditions déterministes de déblocage et source d’autorité des preuves. Les actions manuelles du profil sont des outils de QA, pas des règles de jeu validées.
6. Contrat GameBridge : admissibilité du roster, propriété du catalogue, résultat/annulation/reprise, montage et événements. `setDemoCollection` est un réglage mock, pas une méthode exigée du moteur réel.
7. État de progression serveur : version, révision, identité, preuves de résultats, dédoublonnage, conflits et migrations ; frontières du backend à valider conjointement.
8. Limites d’intégration et tests de non-régression que chaque équipe doit exécuter sur une branche dédiée.

**Validation artistique requise** : silhouettes externes, cadrage portrait et fallback, représentation verrouillé/disponible, densité des fiches, familles/classes et liens de codex. **Validation produit/technique requise** : schéma JSON, migration V1, graphe d’objectifs de QA, politique d’archivage, stockage local et synchronisation proposée. Rien de cela n’est supposé constituer une API ou un contenu définitif.
