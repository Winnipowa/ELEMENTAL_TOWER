# INT-01 — travaux avant premier build mobile avec gameplay réel

La branche consolidée est une référence navigateur hors combat. Aucun build natif, déploiement, publication ou fusion n’a été effectué dans cette mission.

## Avant l’intégration

1. Valider les informations du [rapport GameBridge](INT_01_GAMEBRIDGE_COMPATIBILITY.md) avec le collègue : catalogue, IDs, payloads, montage et cycle de vie. Le contrat actuel n’est pas modifié par INT-01.
2. Développer et tester un adaptateur réel séparé ; garder le mock explicitement démonstratif. Définir la confiance des résultats et la déduplication avant toute progression.
3. Définir l’autorité compte/serveur pour collection, objectifs, missions, Pass et droits cosmétiques. Ne jamais importer automatiquement les déblocages ou marqueurs QA comme propriété réelle.
4. Préserver les namespaces existants et décider explicitement des sauvegardes moteur ; tester une copie de formats représentatifs, corruption, versions futures et conflits sans écraser les originaux.

## Avant de produire le premier paquet

5. Choisir et valider la cible mobile et son enveloppe technique (web/hybride/native), orientations, versions OS et navigation système. Aucun framework d’enveloppe n’est imposé par la consolidation.
6. Définir URLs de ressources, packaging des JSON et images, mode hors connexion souhaité, sécurité du contenu et environnement démo/réel. Le petit serveur de test ne constitue pas une solution embarquée ou de production.
7. Optimiser les six planches originales (~17 Mo) en dérivés documentés : découpe, résolution, mémoire/décodage, cache ; conserver les sources et leurs empreintes. Faire approuver toute modification visuelle de mapping/rang/FX.
8. Garantir un mount moteur stable, démontage, arrière-plan/reprise, interruption de session, annulation et absence de fuite de ressources. Remplacer les contrôles QA par un parcours réel dans un environnement distinct.
9. Mettre en place CI reproductible et matrice de tests, gestion des versions, secrets/signature et configuration de build. La distribution reste une décision ultérieure, pas une conséquence de cette PR Draft.

## Validation sur appareils

10. Android et iOS/Safari physiques : 320/390/430 et petit écran 320×568, safe areas/encoches, clavier virtuel, bouton Retour, rotation si autorisée, zoom/texte agrandi, écran lecteur, touch et contraste réel des gradients.
11. Mesurer temps de chargement, mémoire, autonomie et FPS/FX ; tester réseau faible/absent, fermeture et reprise. Les tests Edge émulés actuels ne couvrent pas ces contraintes matérielles.
12. Valider saturation, halos, douceur fantasy et équilibre nuit/couleur, états verrouillés et textes de prototype. Finaliser les informations de confidentialité selon les services réellement branchés ; aucun analytics de production n’est installé ici.

Les achats, abonnements, backend de production, classements et systèmes absents ne sont pas requis pour exécuter la référence hors combat. Leur éventuelle création relève d’un périmètre et d’une validation distincts ; aucune donnée fictive ne doit donner l’illusion qu’ils existent déjà.
