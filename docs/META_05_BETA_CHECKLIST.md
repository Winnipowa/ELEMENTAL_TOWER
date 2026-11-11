# META-05 — blocages avant bêta avec gameplay

État de préparation hors combat ; aucune autorisation de distribution n’est implicite. Les validations ci-dessous ne sont pas déclarées obtenues par META-05.

## Bloquants d’intégration

- [ ] **Moteur canonique fourni et contrat validé conjointement.** Entry point, exports, mount stable, IDs/catalogues, messages, arrêt, pause/reprise et erreurs. GameBridge et son orchestrateur démo restent inchangés ; les limites d’INT-01 persistent : dépendances au mock, `openRun(..., null)`, refus des résultats non-mock.
- [ ] **Adaptateur réel et tests de conformité.** Fin/abandon/doublons, résultat tardif, annulation au démarrage, destruction/reprise, absence de gain avant confirmation. Aucun mock ne peut alimenter une progression réelle.
- [ ] **Autorité des données et compatibilité.** Catalogue canonique validé, mappings portraits/éléments/FX approuvés, politique de versions et de sauvegardes moteur/serveur ; aucune conversion silencieuse des namespaces démo/V0.9.
- [ ] **Voie de packaging choisie après preuve moteur.** Web/PWA, hybride ou native suivant la [comparaison conditionnelle](META_05_PACKAGING.md), appareil/OS minimal défini. Pas de SDK ou enveloppe installé en anticipation.

## Bloquants de qualification mobile

- [ ] Exécuter la [matrice physique](META_05_DEVICE_PROTOCOL.md) sur Android et iOS : insets réels, barres dynamiques, clavier et zoom au focus, Retour système, lecteur d’écran, zoom et contraste.
- [ ] Approuver les budgets froid/chaud, mémoire totale shell+moteur, FPS, interruption/reprise, batterie et température sur le parc minimal. Les chiffres desktop ne prouvent pas ces budgets.
- [ ] Définir les versions de navigateurs/OS supportées à partir des capacités CSS requises (`dvh`, `color-mix`, `:has`, dialog). Les tests des versions récentes n’établissent pas un support des anciennes versions.
- [ ] Qualifier le focus des champs dont la police calculée est inférieure à 16 px, notamment la recherche : risque de zoom Safari et de perte de surface avec le clavier, à constater sur iPhone. Aucun clavier OS n’a été testé ici.
- [ ] Décider de la relance hors connexion et des mises à jour/cache. Actuellement, une navigation à chaud en mémoire peut fonctionner ; une relance offline n’est pas prise en charge. Aucun service worker installé.
- [ ] Définir une échéance et un parcours de récupération des chargements qui ne terminent pas. Les états loading/503/retry sont testés ; les fetch actuels n’ont pas de deadline explicite. Ne pas masquer ce blocage par une simulation de moteur.
- [ ] Qualifier le paquet réellement produit et son origine stable : accès JSON/modules, chemins d’images, contrôles réseau, données locales et redémarrage après arrêt OS.

## Assets et produit

- [ ] Conserver les sources et la provenance dans le dépôt ; approuver le manifeste d’inclusion du paquet. Les PNG dérivés réduisent le transfert web normal, mais embarquer à la fois toutes les sources et tous les dérivés **augmente** la taille disque. Décider explicitement de la disponibilité des originaux de repli dans un paquet offline.
- [ ] Si le budget mémoire l’exige, concevoir ensuite une découpe/atlas ou des tailles dérivées avec preuve des mappings, pixels et rendus. Cette passe ne change pas les dimensions ni la mémoire RGBA pleine taille.
- [ ] Revue humaine des portraits/FX, saturation/glow, lisibilité et cohérence UI sombre/contenu coloré. Aucun nouveau personnage, rang ou règle introduit.
- [ ] Finaliser les contenus manquants nécessaires au périmètre bêta : onboarding absent, catalogue/conditions canoniques, objectifs et services vérifiés. Boutique/Pass restent des aperçus sans achat ni attribution ; une bêta n’exige pas leur monétisation.
- [ ] Valider le [plan analytics](META_05_ANALYTICS_PLAN.md) avant toute instrumentation : finalités, données, fournisseur, environnement QA séparé, confidentialité et mécanismes de désactivation. **Aucun envoi actif dans META-05.**

## Sortie de revue

- [ ] Faire relire les résultats, écarts et limites ; attribuer un responsable et une preuve à chaque case.
- [ ] Vérifier que les campagnes automatisées repassent sur le commit du premier build réel et que les anomalies physiques sont résolues ou explicitement acceptées.
- [ ] Toute signature, distribution de bêta, publication ou déploiement demande une mission ultérieure. META-05 fournit une PR Draft empilée, sans fusion.
