# ELEMENTAL TOWER — Proposition de contrat GameBridge V0

**Statut : PROPOSÉ, à valider avec le collègue ; aucune implémentation du moteur n'est supposée.**

## But

Le méta-jeu fonctionne sans moteur, avec un adaptateur fictif interchangeable. Le module gameplay est le seul responsable du combat, du calcul d'une partie et des événements de combat. Aucun écran méta ne doit importer directement des variables internes du moteur, copier ses constantes ou reconstruire ses combats.

## Frontière proposée

```text
Application Meta (navigation, collection, monde, profil)
     | demande de catalogue / démarrage d'une expédition
     v
GameBridge (contrat stable, adaptateur mock ou réel)
     | délègue lancement / reçoit fin de partie
     v
Moteur canonique du collègue (combat, fusions, animations)
     | événement de résultat
     v
GameBridge → écran Résultats → service de progression
```

## Données échangées (champs provisoires)

- `GuardianSummary` : `id` stable, `name`, `familyId`, `classId`, `traitIds[]`, `portraitKey?`, `abilitySummary?`, `unlockHint?`. Les stats de combat détaillées ne sont pas détenues par l'UI méta ; elles proviennent du catalogue canonique.
- `RegionSummary` : `id`, `title`, `status` (locked/available/coming_soon), `objective?`, `previewAsset?`.
- `PlayerMetaState` : `schemaVersion`, `unlockedGuardianIds[]`, `unlockedDoctrineIds[]`, `selectedCosmeticIds[]`, `progress`. Pas de rang d'étoile ni d'or de combat persistants.
- `StartRunRequest` : `regionId`, `rulesetVersion`, `playerUnlockedGuardianIds[]`, `selectedDoctrineId?`, `settings`. Le moteur vérifie les IDs et produit un `runId` ; l'UI ne fait pas autorité.
- `RunResult` : `runId`, `rulesetVersion`, `regionId`, `outcome` (victory/defeat/abandoned), `wavesCleared`, `durationSeconds`, `compositionSummary[]?`, `earnedUnlocks[]?`, `verificationStatus` (mock/local/server). L'UI affiche distinctement les résultats de démonstration et les résultats réels.

### Méthodes à discuter

```ts
interface GameBridge {
  getCatalog(): Promise<{
    guardians: GuardianSummary[];
    regions: RegionSummary[];
    rulesetVersion: string;
  }>;
  startRun(request: StartRunRequest): Promise<{ runId: string }>;
  openRun(runId: string, mountTarget: unknown): Promise<void>;
  subscribeRunCompleted(handler: (result: RunResult) => void): () => void;
  stopRun?(runId: string): Promise<void>;
}
```

Ce TypeScript illustre un contrat, **pas une API déjà présente**. `mountTarget`, les méthodes exactes et la forme du moteur seront ajustés à l'implémentation réelle. En prototype HTML, un adaptateur JavaScript peut remplir le même rôle.

## Adaptateurs

- `MockGameBridge` (notre branche) : catalogue de démonstration versionné ; lancement et résultat simulés clairement identifiés « Démo ». Aucune récompense acquise, aucun classement, aucun achat.
- `RealGameBridge` (intégration conjointe ultérieure) : branche le moteur livré par le collègue sans le modifier silencieusement.
- Si le moteur est absent ou incompatible, afficher « Combat indisponible dans cette démo » ou ouvrir le simulateur explicite ; ne jamais afficher une victoire comme authentique.

## Tests de contrat obligatoires avant intégration

1. Une région verrouillée ne lance pas de partie.
2. Aucun gardien non débloqué n'est injecté dans le roster ; le moteur vérifie aussi.
3. Lancement, abandon, défaite, victoire aboutissent à des écrans cohérents.
4. Résultat reçu une fois : aucune double récompense après navigation/rafraîchissement.
5. Or/étoiles/composition temporaires remis à zéro à chaque nouvelle partie ; collection permanente conservée.
6. Catalogue avec nouveaux IDs/nouveaux portraits/valeurs absentes : l'UI ne casse pas.
7. Pas de données moteur conservées sous une fausse sauvegarde serveur.
8. Aucun score PvP classé accepté sur la seule parole du client ; validation serveur à concevoir séparément.

## Informations requises du collègue

- Langage/format d'intégration du moteur, point d'entrée, cycle de vie.
- IDs définitifs : gardiens/familles/classes/traits et version du catalogue.
- Données utiles au codex, portraits et correspondances avec le pack visuel V0.14.
- Signature du lancement, événements/retours de fin de partie, état d'abandon/reprise.
- Autorité des récompenses, sauvegardes et version de règles.
- Limites pour ne pas casser les tests de son gameplay.

**Règle de collaboration :** chaque équipe écrit son adaptateur et ses tests ; aucune équipe ne modifie le moteur ou le méta-jeu de l'autre sans revue. L'intégration finale se fait sur une branche dédiée et une PR contrôlée.
