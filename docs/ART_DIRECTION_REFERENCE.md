# Charte artistique de référence — consolidation INT-01

## Provenance et priorité

La PR #9, branche `feature/da-01-midnight-elemental`, commit `371f8d9e1f32d2bce5d9d876e57653fbbc19ce2a`, ajoute uniquement [ART_DIRECTION_NIGHT_BLUE_V1.md](https://github.com/Winnipowa/ELEMENTAL_TOWER/blob/371f8d9e1f32d2bce5d9d876e57653fbbc19ce2a/docs/ART_DIRECTION_NIGHT_BLUE_V1.md). Cette branche parallèle n’est pas ancêtre de la PR #15. La PR #10 est partie directement de META-03.

Ce document reprend les principes utiles qui manquaient à la référence unifiée. Il ne remplace **ni le CSS ni les assets actuels**, et ne réintroduit pas une ancienne palette comme nouvelle validation. Les rapports DA-01 à DA-04 et UX-01 décrivent les évolutions effectivement présentes.

## Principes conservés de la PR #9

- Bleu nuit dominant, fantasy cute + dark ; éviter cyberpunk, casino, néon permanent et grands aplats violets.
- Accents localisés sur portraits, halos, bordures, icônes, badges et états actifs. Une couleur d’élément n’est pas automatiquement une couleur d’action.
- Pas de sens porté par la couleur seule : statut textuel, repère, focus et interaction restent explicites.
- Contraste cible : au moins 4,5:1 pour le texte courant et 3:1 pour les grandes typographies ; validation sur les petites légendes, gradients et images nécessaire. Cela ne constitue pas une certification WCAG.
- Zones tactiles, safe areas, navigation clavier et réduction des mouvements à préserver. Aucune animation ne doit être indispensable pour comprendre une action.
- Couleurs et correspondances visuelles indépendantes des sauvegardes ; fallback neutre si l’identité canonique est absente.
- Boutique/Pass sans fausse urgence ou vente ; résultat de démonstration jamais présenté comme gain réel.
- Revue humaine des captures et essais iOS/Safari/Android physiques requis avant validation finale.

## Ce qui reste historique, sans import dans la DA courante

La palette initiale proposée dans #9 (`#0B1428`, `#081021`, etc.), ses noms de tokens et sa répartition indicative 80/15/5 ne remplacent pas les choix ultérieurs. L’intention actuelle reste une interface majoritairement bleu nuit avec accents pastel, proche de 80/20 en sensation, sans quota de pixels prétendument exact.

Les étiquettes feu/eau/nature/air/foudre/glace de #9 n’ajoutent aucune famille ou mécanique. Leurs associations doivent venir du collègue. La règle historique invitant à supprimer le violet majoritaire de META-03 n’est pas une demande de supprimer les accents lilas/pastel actuels.

## Référence réellement implémentée

- Fonds : `--background #07111F`, secondaire `#0A1630`, surface `#0E1B38`, surface surélevée `#132345`.
- Texte : `#F3F7FF`, secondaire `#B8C7E6`.
- Accents : cyan `#7DDCFF/#A6F0FF`, lilas `#B8A7FF`, rose `#E49CFF`, menthe `#B7FFB0`, jaune pastel `#E8FF8A`.
- DA-03 : véritables références fournies pour Luma/Mousse/Nyx, six planches intactes et provenance SHA-256 ; aucune conversion d’apparence en donnée canonique.
- DA-04 : couleurs de panneaux décoratives, distinctes des identités élémentaires proposées ; filtre et onglet actif colorés.
- UX-01 : navigation dans sa propre ligne, contenu central défilant, nom de gardien en titre, détails dépliables, outils QA regroupés.

Ces valeurs décrivent la cascade CSS courante, pas une nouvelle refonte. Les familles/classes, éléments, FX et évolutions restent à raccorder au catalogue canonique. Toute modification de contrat ou de mapping doit être validée conjointement.
