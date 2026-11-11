# META-04 — Intégration future : données et services requis

**Contrats proposés pour la revue, pas des API canoniques validées.** Les nouveaux catalogues et états sont exclusivement de démonstration. Le contrat GameBridge existant n’est pas modifié.

## Frontières actuelles

- `LocalProductCatalogs.load()` fournit une enveloppe normalisée `{missions, cosmetics, pass}`. Le transport est injectable ; les trois JSON sont chargés ensemble et leurs références croisées validées. Un adaptateur réel pourra remplacer ce service après accord sur les schémas, versions et sources.
- `ProductScreens` reçoit ce service et un dépôt de préférences, puis présente les données. Il ne possède aucune méthode d’achat, de portefeuille, de vente, d’attribution ou de création de droit.
- `ProductDemoState` est un modèle QA **volatile**, distinct de META-03. `qaSetMission`, `qaSetPass`, `qaMarkTier` et reset ne sont accessibles par l’interface que dans la section QA. Le paramètre `source:'qa'` est un garde-fou de développement, pas une preuve de sécurité ou d’autorité côté serveur.
- `VERIFIED_EVENT_PORT` décrit l’intention : événements vérifiés requis, résultats mock refusés, autorité serveur à concevoir. Aucun processeur d’événements, abonnement gameplay ou conversion de RunResult n’est implémenté.
- `DemoPreferences` reçoit un stockage injectable. Son espace de clés est distinct des sauvegardes de jeu. Les intentions audio ne sont pas envoyées à un moteur absent : les contrôles sont désactivés.

## À obtenir du collègue / de l’intégration serveur

1. **Événements** : IDs/types canoniques, version de règles/catalogue, identité de la session, source d’autorité et preuves de vérification. Les `eventType` des missions JSON sont des propositions illustratives, pas des noms d’événements moteur approuvés.
2. **Progression de missions** : snapshot autoritaire versionné, compteurs, conditions, éligibilité, dépendances, événements uniques/dédoublonnage et politique de reprise. Les rythmes quotidien/hebdomadaire exigeront une horloge et une politique serveur validées, sans compte à rebours inventé côté client.
3. **Récompenses** : catégories/IDs cosmétiques définitifs et règles d’attribution vérifiées. Définir séparément le service d’inventaire et de réclamation idempotente ; aucun marqueur QA ne doit être importé ou converti en produit réel.
4. **Catalogue cosmétique** : IDs stables, localisations, catégories, disponibilité réellement publiée et versions ; illustrations définitives, clés de preview, animations, correspondance gardiens/effets/décors. Les images actuelles sont les références DA-03 et ne représentent pas de nouveaux skins jouables.
5. **Pass** : voies et paliers validés, contenus exclusivement cosmétiques, progression et provenance vérifiées, droits et statuts autoritaires. Pas d’activation premium implicite. Achat/abonnement/expiration éventuels seront un chantier séparé ; aucune hypothèse d’API n’est prise ici.
6. **Audio** : format du moteur, capacités/channels réellement exposés, signatures et cycle de vie à valider conjointement avant tout raccordement. Rien n’est ajouté au GameBridge V0 sans revue.
7. **Préférences / compte** : politique de stockage/synchronisation et migrations, consentements et informations de confidentialité si des services en ligne sont ajoutés. Aucun compte ou transfert cloud dans ce lot.

## Avant remplacement des mocks

Valider les interfaces ensemble, puis écrire un adaptateur de progression serveur **séparé** du modèle QA et des commandes de simulation. Définir les erreurs/réessais/conflits et la vérification des snapshots, préserver les espaces de sauvegarde et garder les données QA isolées. Les schémas actuels locaux acceptent uniquement `source:demonstration` : ne pas les rebaptiser en données réelles ni supposer une migration automatique.

Valider humainement les noms, objectifs, seuils, paliers, récompenses, aperçus et mentions. Les présentations actuelles préparent la navigation et les emplacements, sans constituer des règles de production ou une économie définitive.
