# META-05 — plan analytics proposé, sans collecte

Le [catalogue d’événements versionné](analytics/events.v1.json) est un document de travail. Aucun SDK, abonnement à GameBridge, listener analytics, identifiant, file d’attente, cookie ou appel réseau de télémétrie n’est ajouté. L’activation reste interdite par défaut et demande une validation produit/confidentialité/contrat moteur. Aucun événement n’est réellement envoyé ou enregistré par l’application dans cette passe.

## Événements et sens des mesures

| Événement proposé | Déclenchement à instrumenter ultérieurement | Question produit |
|---|---|---|
| `app_opened` | Shell prêt une fois par document ; route hash distincte d’une ouverture | Fréquence d’entrée, accès direct ou racine |
| `onboarding_step_viewed` / `onboarding_completed` | Étape réellement visible / fin validée du parcours | Où se trouvent les abandons ? L’onboarding est actuellement absent : aucun faux événement de fin |
| `collection_viewed` | État résolu prêt/vide/erreur ; type de filtre sans sa saisie | La collection est-elle accessible et utilisable ? |
| `guardian_viewed` | Fiche affichée, ID du catalogue autorisé et statut | Quels contenus sont consultés ou incompris ? |
| `expedition_prepared` | Préparation valide soumise, une fois par tentative explicite | Le passage de la préparation au lancement fonctionne-t-il ? |
| `run_launch_requested` | Action de lancement acceptée par l’UI | Intention de jouer ; ne signifie pas moteur démarré |
| `run_started` | Confirmation de disponibilité du moteur | Mesurer les lancements effectifs, après accord sur l’événement canonique |
| `run_finished` | Résultat terminal accepté une seule fois | Victoire/défaite/abandon ; distinguer un résultat d’une simple navigation hors écran |
| `cosmetic_previewed` | Aperçu effectivement ouvert | Intérêt pour un concept cosmétique, jamais achat ou possession |

Les champs communs proposés sont des versions autorisées, un environnement (`demonstration`, `qa`, `beta`) et une provenance (`ui`, `mock`, `verified-engine`). Les propriétés détaillées et leurs listes fermées sont dans le JSON. Les noms de catégories sont ceux du **plan**, pas des identifiants à renommer dans les catalogues existants. Leur mapping futur est à valider.

## Frontière démo / réel et qualité

Les flux démo/QA devront être séparés des analyses de parties réelles dès la collecte. Un mock ne peut jamais être requalifié `verified-engine`, déclencher une récompense ou alimenter une mesure d’engagement réel. `local` et `server` restent des valeurs du contrat proposé, pas des preuves que l’UI peut s’attribuer. L’autorité et les événements admis sont à convenir avec le collègue.

Une instrumentation future devra dédupliquer en mémoire les notifications répétées pour la même tentative/session sans envoyer un ID de partie. Retours arrière, double-clic, reprise et événement tardif ne doivent pas doubler une fin. Les erreurs de connexion doivent être mesurées séparément d’une défaite via une taxonomie fermée à définir, jamais un message technique brut. Toute logique d’attribution reste indépendante des analytics.

## Minimisation et validations requises

Pas de nom joueur, email, compte, appareil, identifiant publicitaire, IP comme propriété, URL complète, texte recherché, nom de profil, sauvegarde, composition, erreur brute ou identifiant durable. Les durées/nombres sont regroupés en classes ; les IDs de contenu doivent être limités au catalogue approuvé, sans valeur arbitraire provenant de saisies ou d’un moteur non vérifié.

Avant activation : définir les finalités, responsable, base juridique/consentement selon les territoires et publics, information compréhensible, conservation, accès/suppression, volumes et échantillonnage. Choisir ensuite un fournisseur ou une solution interne, la politique de désactivation et la séparation QA/bêta. Les requêtes d’un éventuel fournisseur pourraient exposer des métadonnées réseau même sans propriété IP : cette question n’est pas résolue par une simple liste blanche.

Prévoir des tests avec récepteur local en mémoire : liste blanche stricte, refus des propriétés inconnues, absence de réseau sans activation, opt-out, aucune donnée de sauvegarde, doublons/reprise, mock séparé du réel. Ils seront nécessaires au moment d’implémenter l’instrumentation ; META-05 ne simule pas leur existence.
