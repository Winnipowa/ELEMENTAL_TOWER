# INT-01 — compatibilité avec un futur GameBridge réel

## Verdict

La séparation hors combat fonctionne et le moteur du collègue n’est ni importé ni modifié. L’application est une référence de démonstration, **pas un adaptateur réel prêt à brancher sans développement**. Le [contrat V0 existant](GAME_BRIDGE_CONTRACT_V0.md) reste une proposition à valider et demeure strictement inchangé. Aucun résultat mock n’est promu en résultat vérifié.

## Interfaces présentes et obstacles observés

| Point | État actuel | Travail futur nécessitant accord |
|---|---|---|
| Catalogue | `getCatalog` du mock et catalogue externe démo validé | Format/version/export canonique, capacités et compatibilité du catalogue ; le loader actuel exige des données de démonstration |
| Injection | `ExpeditionSession` reçoit un bridge ; `app.js` importe encore le singleton mock | Point de composition d’un adaptateur réel, sélection explicite démo/réel ; supprimer les appels mock de ce chemin sans casser le prototype |
| Extensions mock | L’app appelle `configureDemo`, `setDemoCollection` ; `finish()` utilise `completeDemo` | Ces méthodes ne font pas partie du contrat proposé ; séparer les commandes QA et les événements du moteur réel |
| Démarrage / rendu | `startRun`, puis `openRun(runId, null)` dans la démo | Élément de montage réel stable, cycle de vie, reprise/focus, taille et destruction ; le rendu de shell ne doit pas effacer le DOM moteur |
| Résultat | Session n’accepte que `verificationStatus: mock` | Politique explicite des résultats `local/server`, provenance et vérification ; refus actuel volontaire, pas simple flag à changer |
| Abandon / asynchronisme | Abandon mock immédiat, protections de transitions et doublons testées | Annulation pendant démarrage asynchrone, démarrage tardif, événements hors ordre, timeout/erreur/reconnexion, reprise au retour d’arrière-plan |
| Abonnements | `subscribe` / désabonnement et `dispose` présents | Définir propriétaire/lifetime, libération garantie des sessions et ressources réelles, fréquence et type des événements |
| Identifiants | Guardians/région/ruleset `demo-*` / `demo-meta-01` | Table canonique et validation croisée ; ne pas renommer les IDs du collègue ni persister un mapping implicite |
| Récompenses / progression | Aucune écriture à la réception de résultat fictif | Autorité serveur, idempotence, accusé de réception et réconciliation ; aucune migration automatique de démo |
| Missions / Pass | Port descriptif pour événements vérifiés, données QA isolées | Événements reconnus, agrégation, périodes, attribution et droits ; le port actuel ne traite rien de réel |
| Audio / accessibilité | Affichage préparé, audio inactif | Capacités supportées, événements d’options, pause/focus, réduction des effets convenue avec le moteur |

Le schéma `demo-meta-01` est une version de contenu fictif, pas le numéro de version de l’application ni celui du moteur futur. Les résumés, compétences, synergies, rangs et illustrations actuels ne constituent pas un contrat de simulation de combat.

## Checklist à transmettre au collègue

- [ ] Module d’entrée exécutable, plateformes cibles, API publique et méthode de montage/destruction ; aucune hypothèse sur sa structure interne.
- [ ] IDs canoniques stables pour gardiens, éléments, familles, classes, compétences, régions et règles ; versions, références croisées, suppressions et compatibilité.
- [ ] Export de catalogue exemple validé, distinction contenu/possession/déblocage et correspondance officielle avec les portraits/rangs/FX fournis.
- [ ] Capacités supportées : modes, équipe, région, règles, seed éventuelle, reprise et options ; payloads d’entrée et rejets possibles.
- [ ] Événements/payloads de démarrage, prêt, progression, fin, abandon et erreur ; ordre, fréquence, IDs de session, doublons et événements tardifs.
- [ ] Contrat de `stopRun`, annulation en cours de `startRun`, fermeture, destruction, pause/arrière-plan et reconnexion.
- [ ] Résultat exemple victoire/défaite/abandon/erreur, champs obligatoires, vérification locale/serveur et autorité de confiance.
- [ ] Événements de gameplay vérifiés admissibles aux missions/objectifs ; règles de déduplication et de non-attribution avant confirmation.
- [ ] Propriétaire des sauvegardes moteur/V0.9 et de la progression serveur ; namespaces, versionnement et absence de migration implicite du namespace démo.
- [ ] Budget mobile de chargement, mémoire/FX/FPS, compatibilité navigateur/native, contrôle audio et paramètres accessibles.

## Critères avant raccordement réel

Après validation conjointe du contrat, développer un adaptateur isolé et une composition explicite. Ajouter des tests de conformité sur un faux adaptateur asynchrone : démarrage annulé, mount réel, événement tardif/doublon, erreur, fin vérifiée/refusée, démontage et reprise. Tester ensuite le module canonique sur appareils. Ces changements futurs demandent une nouvelle revue ; aucun n’est introduit discrètement dans INT-01.
