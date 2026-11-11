# META-05 — stratégie de packaging conditionnelle

Décision au 11 novembre 2026 : conserver le shell web comme référence de QA et attendre les capacités/export du moteur canonique avant de choisir une enveloppe. Aucun framework, SDK de production, manifest installable ou service worker n’est ajouté. Aucun paquet mobile n’est construit ou publié.

## Comparaison

| Option | Si le moteur permet… | Réutilisation / bénéfices | Coûts et preuves nécessaires |
|---|---|---|---|
| Web puis PWA | Exécution navigateur JS/Wasm/WebGL compatible avec les OS cibles, montage dans une page et cycle de vie web | Réutilisation directe du shell, catalogue et assets ; accès de QA simple | PWA encore absente : manifest/icônes, HTTPS hors localhost, cache et stratégie de mises à jour/offline à concevoir ; contraintes mémoire/GPU, sauvegardes d’origine et Safari à qualifier |
| Hybride avec WebView | Export web fiable, ou vue moteur native intégrable avec frontière de messages/montage approuvée | Shell largement réutilisable et ressources embarquables ; accès à des fonctions OS si réellement nécessaires | Android WebView et iOS WKWebView, pont natif sécurisé, navigation système, double cycle de vie, mémoire du WebView + moteur ; signature/builds/versions à maintenir ; aucun gain FPS automatique |
| Application native / shell dans le moteur | Export natif privilégié ou API graphique du moteur incompatible avec WebView | Cohérence du rendu et cycle de vie avec le moteur, contrôle des ressources | Réécriture ou adaptation substantielle des vues web ; catalogue portable seulement après contrat ; chaîne iOS/Android et revue visuelle à prévoir ; ne pas embarquer une deuxième simulation du combat |

## Arbre de décision avant engagement

1. Obtenir du collègue une preuve minimale de son module : technologie, exports, entry point, dimensions, ressources, contraintes CPU/GPU/mémoire, audio, montage/destruction et pause/reprise. Ne pas déduire ces réponses des anciens prototypes HTML.
2. Si l’export web est validé sur Android et Safari physiques avec budgets acceptables, évaluer d’abord la voie web/PWA. Le shell actuel ne garantit pas un redémarrage hors connexion : le test offline le documente.
3. Si une distribution embarquée ou une capacité OS justifie une enveloppe, prototyper une intégration hybride **après** cette preuve et mesurer son coût mémoire. Comparer les enveloppes à ce moment-là ; aucune préférence de framework n’est imposée ici.
4. Si le moteur impose le natif, définir la place du shell (UI moteur/native ou WebView secondaire) et la frontière de messages avec l’équipe. Mesurer un écran réel de combat et une transition retour avant une décision de réécriture.

## Points transverses

Le retour d’un navigateur dans l’historique hash est testé ; le geste Retour Android prédictif, la fermeture de modales et la sortie à la racine relèvent de la future enveloppe et d’essais physiques. Aucune interception globale n’est ajoutée pour donner l’illusion d’un retour système natif.

Conserver une origine stable pour les ressources et le stockage. Un changement d’origine/package ne doit pas déclencher une migration silencieuse des sauvegardes de démo ou V0.9. Définir une politique de déconnexion, mises à jour atomiques/catalogues et restauration après arrêt OS. Aucun stockage local ne constitue à lui seul une progression serveur garantie.

Les dérivés PNG recompressés gardent le même décodage pleine dimension ; ils réduisent les octets transférés, pas le budget RGBA/GPU. Définir un budget global shell + moteur sur les appareils minimaux avant de choisir l’enveloppe. Le candidat WebP a été écarté de cette passe après comparaison du rendu des petits FX.

## Références primaires consultées

Les critères d’installation PWA varient selon navigateur et plateforme ; manifest et conditions de distribution sont à préparer après décision. [MDN — rendre une PWA installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable).

Android documente le coût mémoire propre au WebView et la navigation depuis son hôte. [Android — contenu web dans WebView](https://developer.android.com/develop/ui/views/layout/webapps/webview). Le Retour prédictif demande une intégration spécifique côté application Android. [Android — Predictive Back](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture).

WKWebView est le composant Apple à examiner pour une enveloppe web iOS. [Apple — WKWebView](https://developer.apple.com/documentation/webkit/wkwebview). Les quotas et l’éviction restent à considérer pour les données web locales. [WebKit — politique de stockage](https://webkit.org/blog/14403/updates-to-storage-policy/).

Cette recommandation est une déduction du code actuel et de ces contraintes documentées, pas une validation du moteur absent.
