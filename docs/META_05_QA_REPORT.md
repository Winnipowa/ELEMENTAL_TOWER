# META-05 — préparation technique et QA mobile

Référence `0.4.1-meta.5`, branche `feature/meta-05-mobile-readiness`, créée depuis PR #16, commit `d2184f51dc26de6e6592ce3aa8ae988f1efc58a2`. Aucun moteur canonique n’est intégré. Aucun gameplay, GameBridge, orchestrateur, contrat, catalogue, mapping, CSS ou logique de sauvegarde n’est modifié. Aucun analytics réel, SDK de production, framework mobile ou service worker n’est ajouté.

## Ce que livre cette passe

- Six PNG recompressés dans `meta/art/mobile/`, sources et provenance DA-03 intactes ; URL de transport dérivée et repli unique vers le PNG d’origine en cas d’échec.
- Vérification RGBA pleine taille et mappings, parcours sur Edge et WebKit Windows, conditions dégradées, comparaisons visuelles originales/optimisées et mesures de chargement/DOM/heap.
- [Bilan des performances et assets](META_05_PERFORMANCE.md), [stratégie de packaging conditionnelle](META_05_PACKAGING.md), [plan analytics sans collecte](META_05_ANALYTICS_PLAN.md), [matrice/protocole physique](META_05_DEVICE_PROTOCOL.md) et [checklist bêta](META_05_BETA_CHECKLIST.md).

## Compatibilité : constat actuel et frontière de preuve

| Sujet | Vérification disponible | Limite / décision restante |
|---|---|---|
| Navigateurs | Edge installé et WebKit Playwright sur Windows, routes/contrôles/rendu | Ni Chrome Android ni Safari iOS physiques ; versions OS minimales non décidées |
| Dimensions | 320×844, 390×844, 430×844, 320×568 dans les deux moteurs | DPR/tactile émulés ; pas de certification d’un modèle de téléphone |
| Hauteur / insets | `viewport-fit=cover`, `100dvh`, `env(safe-area-inset-top/bottom)` ; resize et insets CDP synthétiques | Safe areas physiques, barre d’adresse Safari, encoche/indicateur d’accueil et paysage non qualifiés |
| Retour | Historique hash et retours UI, scénario d’abandon existant | Retour système/prédictif Android, swipe Safari et sortie à la racine dépendent de l’enveloppe future |
| Clavier | Focus et viewport réduit ; police de recherche mesurée | Clavier logiciel, zoom Safari pour champs <16 px et défilement sous clavier à tester sur téléphone |
| CSS | Capacités `dvh`, `color-mix`, `:has`/composants modernes à qualifier selon cible | Pas de promesse de compatibilité avec un ancien Safari non testé ; aucun fallback historique ajouté sans cible décidée |
| Mémoire | Taille RGBA calculée, heap JS après GC et DOM après cycles | Pas de RSS/GPU, pic mémoire complet, crash OS, batterie ou thermique mesurés |
| Offline | Navigation à chaud en mémoire, échec attendu de relance et reprise réseau | App non installable/offline à ce stade, cache/mise à jour à concevoir après choix packaging |
| Moteur | Tous les écrans hors combat s’ouvrent sans moteur ; mock distinct | Les blocages GameBridge d’INT-01 restent ouverts ; aucun vrai lancement/résultat validé |

Les instruments de navigateur ne remplacent pas un appareil. Le protocole physique indique **NON EXÉCUTÉ** pour chaque cible et conserve une fiche de résultat distincte.

## Vérification des illustrations

Les six PNG sources représentent **17 020 255 octets**. Les dérivés PNG représentent **14 938 449 octets**, soit **2 081 806 octets économisés (12,23 %)**. Dimensions 1122×1402, transparence et pixels RGBA inchangés. Les coordonnées de portraits, poses, rangs, projectiles, auras et piédestaux ne changent pas ; aucun nouveau personnage ou lien canonique n’est inventé.

`npm run assets:mobile` reproduit les dérivés avec FFmpeg (outil de build local seulement), contrôle les SHA sources et la parité RGBA, puis écrit un manifeste de provenance dérivée séparé. L’ancien manifeste ne décrit toujours que les sources intactes. `meta/art.js` ne change que le chemin de l’image et son attribut de repli ; un garde statique inverse exactement ce delta et compare au fichier hérité. Les autres fichiers protégés restent vérifiés octet pour octet.

Le repli se limite à une tentative vers l’original ; si les deux ressources manquent, le portrait garde son indication textuelle indisponible. Les badges/FX restent décoratifs et ne changent aucune donnée. Pas de boucle de retry, de cache applicatif ou de changement de sauvegarde.

### Candidats et limites visuelles documentés

Un candidat WebP sans perte a été généré et comparé : RGBA visible identique avec FFmpeg, mais arrondis de prémultiplication différents dans le décodage navigateur. Il n’est **pas livré ni activé**. Les PNG recompressés retenus passent l’égalité stricte RGBA, y compris transparence, dans chaque moteur testé.

Les comparaisons de captures complètes sont conservées comme preuve de revue, sans prétendre une égalité pixel à pixel du screenshot : des variations A/A de rastérisation/cache des petits FX sont apparues dans Edge, même sans changement d’asset. Le comparatif Edge est isolé en rendu logiciel, la QA fonctionnelle et les performances utilisent le rendu normal ; WebKit conserve son rendu par défaut. Les écarts exacts sont consignés, et ne sont pas masqués par une tolérance présentée comme une validation artistique. La preuve automatisée stricte concerne les pixels des assets et leurs mappings ; la revue finale des captures reste humaine.

## Conditions dégradées et limites révélées

- Blocage d’un dérivé : repli sur la source ; blocage des deux : portrait indisponible explicite et navigation préservée.
- Catalogue retardé puis HTTP 503 : états chargement/erreur, retry et récupération. Les tests hérités couvrent aussi erreurs/vide des catalogues Missions/Boutique/Pass, préférences corrompues et sauvegardes anciennes.
- Hors connexion après chargement : Paramètres et navigation en mémoire utilisables ; rechargement offline non pris en charge, puis retour au catalogue après rétablissement du réseau.
- Profil de performance dégradé : 4 Mbit/s descendants, 80 ms de latence configurée, 1 Mbit/s montant, CPU desktop ×4. Ce ne sont pas les performances d’un téléphone ou d’un réseau mobile réel.
- Les fetch n’ont pas de deadline explicite dans les services actuels. Un chargement suspendu indéfiniment reste un travail avant bêta ; les tests de 503 ne prouvent pas la gestion d’une requête qui ne termine jamais.

## Reproduction et résultats

Prérequis : Node 24+, dépendances du lock, Edge installé, Git/tar et historique des commits pour la campagne héritée. Le runtime de test WebKit peut être installé localement avec `npx playwright install webkit`, en définissant `PLAYWRIGHT_BROWSERS_PATH` si nécessaire ; ce téléchargement ne fait pas partie de l’application. FFmpeg n’est requis que pour régénérer les assets, pas pour les tests ou l’exécution du shell.

```sh
npm ci --ignore-scripts
npm run test:mobile
```

La campagne utilise un port local isolé, lance la référence INT-01 complète puis la QA mobile et les performances séquentiellement. `test-results/meta-05/` contient les JSON/journaux/captures ; aucun navigateur personnel ni sauvegarde réelle n’est utilisé. Les ressources réseau de QA fonctionnelle sont restreintes à localhost. Le plan analytics n’est importé par aucun module de l’application.

La campagne complète `npm run test:mobile` termine avec le code 0 : référence héritée (109,95 s), QA mobile (60,46 s), mesures (101,89 s). **30 tests unitaires réussis**, aucun échec ni test ignoré ; les assertions finales d’en-tête PNG ont également été relancées avec succès par `npm test`. Un essai unitaire lancé sans autorisation localhost a été bloqué par le sandbox (EACCES), puis relancé dans les mêmes permissions locales que la campagne réussie ; aucun correctif applicatif n’a été nécessaire.

La référence héritée conserve ses six étapes, parcours META-01/02/03/04/UX-01 et cinq replays DA/UX historiques sur leurs commits. La QA ajoutée visite **24 routes × 4 formats × 2 moteurs = 192 visites**, vérifie 12 couples de planches (6 par moteur) avec RGBA exact, et produit 36 comparaisons d’écrans avant/après. Les 12 ouvertures de performance et 150 transitions sont séparées de ces visites. 141 captures META-05 sont livrées (vues de QA, comparaisons, erreurs et insets).

Les premières assertions de comparaison exigeaient un screenshot parfaitement identique ; les essais A/A ont montré que ce critère confondait cache de rastérisation et changement d’asset. Les différences sont maintenant **mesurées et affichées**, sans être qualifiées d’égalité ni d’approbation artistique. Dans la campagne finale, le maximum est de 124 pixels sur un comparatif Edge 320 px ; les autres groupes sont identiques. Les 12 contrôles RGBA restent stricts et réussis, sans tolérance.

Les résultats exécutés et l’environnement sont fournis dans le [dossier de preuves](audit/meta-05/README.md). Les tests automatiques ne ferment pas les cases physiques, les validations DA/contrat ni les budgets produit avant bêta. Aucun test de téléphone réel n’est déclaré effectué.
