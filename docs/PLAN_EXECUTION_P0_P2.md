# ELEMENTAL TOWER — Plan d'exécution produit et technique

**Version :** 4 novembre 2026 · associé au GDD V1.1  
**Statut :** backlog de travail ; les paramètres non explicitement validés sont des hypothèses testables.  
**Décision impérative :** en PvP, le joueur n'utilise que les gardiens et doctrines de SA collection. **Aucun accès compétitif automatique au catalogue complet.**

## Règles de méthode

- Priorité à **une seule expédition complète et enregistrable**, avant de multiplier les modes.
- Un ticket est terminé uniquement quand ses critères d'acceptation sont vérifiables, et non lorsque l'interface paraît finie.
- Le collègue travaille sur les gardiens, familles, classes, compétences, animations et leur équilibre. L'équipe produit définit l'expérience, les écrans, la progression, l'économie, les mesures et les règles de compétition. Les contrats de données et les tests sont partagés.
- Aucun achat en diamants ne débloque de puissance, d'unités, de doctrines, d'or de combat ou de statistiques PvP. L'XP ×2 éventuelle concerne exclusivement les récompenses cosmétiques du Pass.
- Version de référence pour tests UI : prototype HTML V0.8, **six vagues** actuellement ; les **douze vagues** et trois boss sont des objectifs, pas des fonctionnalités déjà présentes.

## P0 — Première expédition complète

### ET-001 — États d'une expédition
**Responsable :** produit (spécification) → intégration technique  
**Dépend de :** règles de combat du collègue  
**Livrable :** menu → carte → préparation → combat → récompense → carte.

**Critères d'acceptation :**
- Un joueur démarre une partie vierge ; l'or de combat et les étoiles sont réinitialisés.
- Lancement manuel ou préparation avec compte à rebours clair ; prochaine vague annoncée.
- Douze vagues tests, boss aux 4/8/12 ; défaite, victoire et reprise/rejouer fonctionnent.
- Aucun écran bloquant, aucun achat ni publicité nécessaire pour terminer.

### ET-002 — Interactions et réserve sans frustration
**Responsable :** produit UX + intégration technique  
**Dépend de :** identifiants de gardiens stables.

**Critères d'acceptation :**
- Trois offres visibles, huit places de défense, cinq places de réserve (valeurs à régler).
- Glisser-déposer vers case libre, déplacement et échange sans coût.
- Deux gardiens de même identité et de même rang fusionnent ; identités incompatibles refusées sans perte.
- Réserve pleine : l'achat est bloqué explicitement ou déclenche une étape de rangement, jamais une perte silencieuse d'or/gardien.
- Revente à 60 % du coût investi ; confirmation si rang élevé ; transaction atomique.
- Fonctionne sur téléphone portrait à un doigt, y compris 320 px de large.

### ET-003 — Télémetrie du gameplay
**Responsable :** produit/tech  
**Livrable :** schéma d'événements et tableau de tests internes.

**Critères d'acceptation :**
- Capturer au moins : lancement/tutoriel terminé/partie finie, vague, achat/revente, fusion, synergie activée, rang maximal, réserve pleine, abandon, nouvelle tentative.
- Anonymiser/pseudonymiser les identifiants ; aucune donnée inutilement nominative.
- On peut répondre à : « Quelles vagues causent l'abandon ? », « Quelles fusions arrivent réellement ? », « Combien de joueurs relancent après un échec ? ».

### ET-004 — Test de plaisir et profondeur
**Responsable :** produit + collègue  
**Livrable :** protocole de 10 tests guidés par observation, puis ajustements.

**Critères d'acceptation :**
- Observer la première partie sans expliquer les commandes à l'oral.
- Tester au moins trois compositions viables avec au moins deux synergies qui changent les comportements, pas seulement les stats.
- Noter les hésitations, les erreurs et les moments de satisfaction (fusion, ultime, boss).
- Ne pas ajouter de nouveaux systèmes avant d'avoir traité les principaux blocages observés.

## P1 — Progression et collection

### ET-005 — Sauvegarde de collection
**Responsable :** produit/tech  
**Critères d'acceptation :**
- Débloquer un gardien après un objectif PvE et le conserver après redémarrage.
- Un gardien verrouillé n'est ni achetable en partie ni tiré par la boutique.
- Étoiles et or repartent à zéro à chaque expédition ; skins équipés demeurent.
- Déblocages auditables : gardien, source, date/étape, version de règles.

### ET-006 — Chapitre de départ et progression J1→J7
**Responsable :** produit (lore & parcours) + collègue (assets/personnages)  
**Critères d'acceptation :**
- Débloquer les premières familles/classes via boss et objectifs narratifs gratuits.
- Les premières compositions accessibles sont réellement viables.
- Lore 1–3 lignes, ignorable et retrouvable dans le codex.
- Un seul prochain objectif visible à la fin de chaque session.
- La collection d'au moins six gardiens, deux familles et deux classes est atteignable sans payer et sans hasard non maîtrisé.

### ET-007 — Codex et identité des gardiens
**Responsable :** produit UX + collègue (fiches/visuels)  
**Critères d'acceptation :**
- Montrer nom, famille, classe, attaque, compétence, synergies, skin et états 1★→5★.
- Les gardiens verrouillés montrent le critère de déblocage sans présenter de vente de puissance.
- Recherche/filtre par famille et classe ; lisible en portrait.

## P2 — PvP social avec collection personnelle

### ET-008 — Contrat d'éligibilité PvP
**Responsable :** produit/tech ; **après validation ET-005/006**  
**Règle :** collection personnelle uniquement.

**Critères d'acceptation :**
- L'accès est ouvert selon un seuil provisoire (6 gardiens, ≥2 familles, ≥2 classes et deux synergies disponibles), ajusté après tests.
- Le serveur vérifie les gardiens et doctrines présents dans chaque roster, **avec l'historique des déblocages du compte**.
- Un joueur ne peut pas recruter un gardien verrouillé ; aucun Pass/diamant n'améliore sa sélection compétitive.
- Un rang 5★ n'est conservé dans aucun match ultérieur.

### ET-009 — Défi asynchrone reproductible
**Responsable :** produit/tech  
**Livrable :** partager un défi, le compléter avec sa propre collection et comparer les résultats.

**Critères d'acceptation :**
- Même carte, mêmes vagues, mêmes points de vie, même budget initial et mêmes règles de boutique pour tous.
- **Le pool de recrutement diffère selon les unités réellement débloquées** : ne pas annoncer des tirages identiques.
- La graine et la version des règles sont enregistrées, avec score départagé par vagues puis vie puis durée (proposition).
- Résultat classé impossible à fabriquer en modifiant seulement le JavaScript du client ; validation serveur nécessaire.
- Si l'adversaire a une collection très différente, cet écart est visible ; le premier mode peut rester non classé.

### ET-010 — Matchmaking et équité
**Responsable :** produit/tech + collègue (équilibrage)  
**Livrable :** règles d'appariement et rapport d'équité avant mode classé.

**Critères d'acceptation :**
- Appariement basé sur **la collection totale débloquée** (taille + couverture des synergies) puis sur une cote de compétence distincte.
- Pas de manipulation par retrait temporaire de gardiens du deck.
- Faible population : proposer un défi asynchrone ou non classé au lieu de prétendre avoir trouvé un duel équitable.
- Suivre les taux de victoire selon taille/diversité de collection et compétence estimée ; ajuster les seuils selon les résultats mesurés.
- Les récompenses compétitives sont cosmétiques et ne rendent pas un joueur plus puissant.

## P2 — Économie premium seulement après preuve d'intérêt

### ET-011 — Boutique cosmétique et essais
**Responsable :** produit UX/tech + collègue (assets)  
**Critères d'acceptation :**
- Deux monnaies uniquement : or réinitialisé par expédition, diamants persistants et achetés en euros.
- Trois premiers skins avec aperçu en situation, y compris compétence et transformation.
- Une offre d'essai indique explicitement le nombre de combats restants.
- Aucun skin n'affecte hitbox, portée, vitesse ou visibilité utile au joueur.

### ET-012 — Pass non compétitif
**Responsable :** produit/tech  
**Critères d'acceptation :**
- Voie gratuite et voie premium, récompenses cosmétiques exclusivement.
- Bonus XP ×2 uniquement sur les niveaux **du Pass**, jamais sur le rythme de déblocage des gardiens/doctrines PvP.
- Les niveaux, dates de saison, règles d'expiration et prix sont lisibles.
- Paiements natifs et vérification serveur seulement quand le produit est réellement prêt à être vendu.

## Dépendances essentielles

```text
ET-001 Expédition ──→ ET-003 Mesures ──→ ET-004 Tests
       │                    │
       ├─→ ET-005 Sauvegarde ─→ ET-006 Chapitre/déblocages ─→ ET-008 PvP éligibilité
       │                              │                           │
       └─→ ET-002 UX fusions ─────────┘                           └─→ ET-009 Défis ─→ ET-010 Matchmaking

ET-007 Codex dépend de ET-005 + données gardiens du collègue
ET-011 Boutique et ET-012 Pass attendent validation gameplay + intérêt cosmétique
```

## Mesures de lancement (hypothèses, non garanties)

- **Tutoriel :** compréhension autonome sans long texte et absence d'actions bloquantes.
- **PVE :** au moins deux à trois compositions capables de progresser sans nécessité d'un unique gardien rare.
- **Rétention :** mesurer le taux de relance volontaire, puis J1/J7 sur cohortes suffisantes ; ne pas confondre intention déclarée et rétention effective.
- **PvP :** victoire par écart de collection à compétence comparable ; ne pas annoncer une équité démontrée sans volume de matchs suffisant.
- **Monétisation :** regarder les prévisualisations et essais avant d'investir dans un Pass complet.

## Points qui peuvent attendre (pas d'aval utilisateur)

- Barèmes numériques de matchmaking, cotes, taux de tirage et probabilités exactes.
- Prix précis des skins et packs de diamants, à confirmer selon les stores.
- Durée définitive d'une saison et cadence des mises à jour.
- Nombre final de gardiens au lancement et contenu du deuxième chapitre.

## Point qui nécessiterait un nouvel aval

Tout changement du principe **« uniquement ma collection en PvP »**, ou l'introduction d'avantages compétitifs payants. Aucun de ces changements n'est proposé ici.