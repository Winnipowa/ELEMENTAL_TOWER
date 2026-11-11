import {test} from 'node:test';
import assert from 'node:assert/strict';
import {MockGameBridge} from '../meta/bridge.js';
test('isolated catalog and unavailable engine',async()=>{const bridge=new MockGameBridge();const a=await bridge.getCatalog();a.guardians.length=0;assert.equal((await bridge.getCatalog()).guardians.length,3);await assert.rejects(bridge.startRun(),/indisponible/);await assert.rejects(bridge.openRun(),/connecté/);assert.doesNotThrow(bridge.subscribeRunCompleted(()=>{}));});
