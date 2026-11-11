// Fixtures UI only. No gameplay constants or canonical IDs are imported.
export const catalog = {
 rulesetVersion: 'demo-meta-01',
 regions: [
 {id:'demo-dawn',title:'Aurore',status:'available',objective:'Découvrir le territoire d’Aurore'},
 {id:'demo-forest',title:'Sylve',status:'locked'},
 {id:'demo-flux',title:'Sanctuaire des Flux',status:'coming_soon'},
 {id:'demo-shadow',title:'Crépuscule',status:'locked'}],
 guardians: [
 {id:'demo-luma',name:'Luma',familyId:'Aurore',classId:'Arcaniste',traitIds:[],unlocked:true,color:'#ffd396'},
 {id:'demo-mousse',name:'Mousse',familyId:'Sylve',classId:'Protecteur',traitIds:[],unlocked:true,color:'#94dfc7'},
 {id:'demo-nyx',name:'Nyx',familyId:'Crépuscule',classId:'Arcaniste',traitIds:[],unlocked:false,color:'#cf9bfb'}]
};
export class MockGameBridge {
 async getCatalog(){ return structuredClone(catalog); }
 async startRun(){ throw new Error('Combat indisponible dans cette démo.'); }
 async openRun(){ throw new Error('Aucun moteur connecté.'); }
 subscribeRunCompleted(){ return () => {}; }
}
// Injection point for a future reviewed adapter implementing GAME_BRIDGE_CONTRACT_V0.
export const bridge = new MockGameBridge();
