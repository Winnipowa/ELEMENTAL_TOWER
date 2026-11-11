# META-05 — matrice QA et protocole téléphones physiques

**Aucun téléphone physique n’a été utilisé dans cette mission.** Edge/Chromium et WebKit Playwright s’exécutent sur Windows ; une dimension et un mode tactile ne certifient ni Android ni Safari iOS. Les résultats automatisés sont distincts dans le rapport QA. Toute ligne physique ci-dessous reste **NON EXÉCUTÉE**, sans exception implicite.

## Parc d’essai à faire approuver

| Cible | Choix à renseigner | Risques à couvrir | Statut |
|---|---|---|---|
| Android entrée de gamme | Modèle, RAM, OS minimal supporté et version Chrome/WebView | Mémoire, décodage, réseau faible, Retour par bouton | NON EXÉCUTÉ |
| Android récent à encoche | Modèle/OS et Chrome, puis future enveloppe si choisie | Insets, Retour gestuel/prédictif, arrière-plan | NON EXÉCUTÉ |
| Petit iPhone de référence | Modèle/OS supporté à décider, Safari exact | Surface disponible, zoom au focus, clavier, texte agrandi | NON EXÉCUTÉ |
| iPhone récent à encoche | Modèle/OS et Safari, puis éventuel mode écran d’accueil | Safe areas, barre d’adresse dynamique, gestes, interruption | NON EXÉCUTÉ |
| iOS/Android minimal retenu | Versions décidées avec l’équipe, sans déduction depuis WebKit de test | Fonctionnalités CSS, erreurs et redémarrage | NON EXÉCUTÉ |

Les 320/390/430 px et 320×568 sont des **viewports CSS de test**, pas une liste de modèles certifiés. Le DPR, la surface réellement disponible et les insets doivent être notés pour chaque appareil. Tester aussi la taille réelle de chaque téléphone, même différente de ces quatre formats.

## Préparer une session

1. Noter commit, version, mode navigateur/enveloppe, modèle, RAM, OS, navigateur/WebView, viewport/DPR, réseau, niveau de batterie et température initiale. Utiliser un profil QA contenant seulement des fixtures ; ne pas effacer des données personnelles.
2. Charger le paquet ou l’URL de QA approuvé par l’équipe. META-05 ne déploie aucune URL et n’ouvre pas de tunnel réseau. Le serveur local de développement reste lié à localhost.
3. Enregistrer une capture ou une vidéo de chaque problème avec route et étapes exactes. Ne pas inclure noms personnels, sauvegardes ou identifiants. Conserver les résultats dans une fiche distincte par appareil.
4. Mesurer une ouverture froide après fermeture complète, puis chaude, trois fois chacune. Mesurer la collection et une fiche gardien ; distinguer UI lisible et illustrations entièrement prêtes.

## Matrice d’exécution

| ID | Essai | Critère observé | Automatisation actuelle | Physique |
|---|---|---|---|---|
| M01 | Monde → Collection → Gardien → Codex → retour | Portraits, états, libellés, accès à tous les contrôles | Edge + WebKit, 4 formats | NON EXÉCUTÉ |
| M02 | Missions, Boutique, aperçu, Pass, Profil, Paramètres | Chargement, gestes, état prototype clair, aucun achat ou droit réel | Routes + suites produits existantes | NON EXÉCUTÉ |
| M03 | 320×568 et texte agrandi/contraste | Contenu défilable, nav et CTA atteignables | Suites héritées et contrôles DOM | NON EXÉCUTÉ |
| M04 | Encoches et indicateur d’accueil | Header/onglets en zone sûre, dernier bouton accessible | Insets CDP synthétiques ; pas une encoche réelle | NON EXÉCUTÉ |
| M05 | Barre Safari qui se replie, resize et rotation | Hauteur cohérente, pas de contenu définitivement masqué | Resize géométrique seulement ; portrait comme référence | NON EXÉCUTÉ |
| M06 | Focus recherche et nom de profil, saisir/fermer clavier | Pas de zoom gênant, clavier ne bloque pas CTA/retour | Focus + petit viewport ; **clavier OS non simulé** | NON EXÉCUTÉ |
| M07 | Retour bouton/gestuel et swipe Safari | Historique cohérent ; modale/écran/racine définis ; pas de sortie involontaire | Retour navigateur hash testé | NON EXÉCUTÉ |
| M08 | Préparation → lancement mock → résultat / abandon | Scénario démo clair, aucun gain persistant | Suites META-02 complètes | NON EXÉCUTÉ |
| M09 | Débit limité, latence, 503, image indisponible | État chargement/erreur, retry, repli visuel, navigation utilisable | CDP réseau/CPU ; erreurs injectées | NON EXÉCUTÉ |
| M10 | Hors connexion à chaud, puis relance à froid | Documenter la limite : aucune relance offline garantie sans stratégie de cache | Limite vérifiée, pas de promesse PWA | NON EXÉCUTÉ |
| M11 | Basculer réseau/avion et revenir | Réessai cohérent, pas de perte de préférence/progression QA | Reprise réseau dans le test | NON EXÉCUTÉ |
| M12 | 15–30 min de navigation / 30 cycles | Pas de fuite visible, ralentissement, écran vide, surchauffe | 150 transitions, heap JS et DOM diagnostiques | NON EXÉCUTÉ |
| M13 | Arrière-plan, verrouillage, interruption, arrêt OS | Reprise sûre ; statut de la session réelle à définir avec le moteur | Non qualifié par desktop headless | NON EXÉCUTÉ |
| M14 | VoiceOver / TalkBack, zoom et taille système | Ordre, titres, focus, labels de verrouillage, réduction animations | Vérifications DOM/clavier partielles | NON EXÉCUTÉ |
| M15 | Sauvegarde QA puis fermeture/reprise | Namespace isolé, pas d’attribution mock, origine stable | Tests hérités en contextes temporaires | NON EXÉCUTÉ |
| M16 | Comparer couleurs et portraits sur écrans réels | Saturation/glow, détails dans les ombres, états lisibles | RGBA et captures originales/optimisées comparés | NON EXÉCUTÉ |
| M17 | Intégration moteur et options audio réelles | FPS/mémoire, mount, pause/reprise, résultat vérifié | **Moteur absent, non testable** | NON EXÉCUTÉ |

## Mesures et fiche de résultat

Utiliser Safari Web Inspector et les outils Android/Chrome du dispositif retenu ; pour une enveloppe, ajouter les instruments/profilers natifs appropriés. Noter RSS/processus, mémoire image/GPU disponible, pics, FPS, batterie et température : le heap JS seul ne suffit pas. Les accès de debug doivent rester dans un environnement QA approuvé.

Fiche minimale : `ID test | commit | appareil/OS/navigateur | étapes | attendu | observé | temps froid/chaud | mémoire pic/stable | capture | PASS/FAIL/BLOQUÉ/NON EXÉCUTÉ | responsable | ticket`. Répéter un échec deux fois, conserver le premier contexte, ne pas le classer PASS au seul motif qu’un rechargement le masque.

Les budgets produit à approuver concernent appareil minimal, temps UI/art, mémoire shell+moteur, FPS, reprise et autonomie. Le plafond de 60 s du smoke de performance desktop détecte un blocage de test ; **il ne constitue pas un budget bêta acceptable**. Une bêta gameplay ne peut pas être validée uniquement à partir des tests de mock.
