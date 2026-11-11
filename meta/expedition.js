/** Session-only orchestration. Does not grant rewards or write PlayerMetaState. */
export class ExpeditionSession {
 constructor(bridge,onChange=()=>{}) {
  this.bridge=bridge;this.onChange=onChange;this.state='idle';this.result=null;this.error='';this.runId=null;
  this.unsubscribe=bridge.subscribeRunCompleted(result=>{
   if(result.runId!==this.runId || this.state!=='running' || result.verificationStatus!=='mock' || !['victory','defeat','abandoned'].includes(result.outcome))return;
   this.result=structuredClone(result);this.state='completed';this.onChange();
  });
 }
 async start(request){
  if(this.state==='starting'||this.state==='running')return;
  this.state='starting';this.result=null;this.error='';this.runId=null;this.onChange();
  try {
   const {runId}=await this.bridge.startRun(request);this.runId=runId;
   // Subscribe before openRun; a real adapter may complete synchronously on mount.
   this.state='running';await this.bridge.openRun(runId,null);
   this.onChange();
  }catch(error){
   this.state='error';this.error=error.message||'Moteur indisponible.';
   if(this.runId)try{await this.bridge.stopRun?.(this.runId);}catch{/* original error remains visible */}
   this.onChange();
  }
 }
 async finish(){try{await this.bridge.completeDemo(this.runId);}catch(e){this.fail(e);}}
 async abandon(){try{await this.bridge.stopRun?.(this.runId);}catch(e){this.fail(e);}}
 fail(error){this.state='error';this.error=error.message;this.onChange();}
 dispose(){this.unsubscribe();}
}
