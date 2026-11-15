import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, cpSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { runAgent } from '../src/agent.ts';
import { DISCLAIMER_VERSION } from '../src/service.ts';
import { cleanScope, income, zeroDeductions, noForeign } from './fixtures.ts';
const consent={version:DISCLAIMER_VERSION,user_confirmed:true};
const facts={scope:cleanScope,income,deductions:zeroDeductions,foreign:noForeign};
const request={consent,facts,facts_confirmed:true};
const run=(op:string,data:unknown={})=>runAgent(op,data) as any;

test('discovery is consent-free; financial operations require current explicit consent and confirmed patches',()=>{
  assert.equal(run('disclaimer').version,DISCLAIMER_VERSION);
  assert.equal(run('capabilities').execution,'one_shot');
  const schema=run('schema');assert.ok(schema.operations.worksheet);assert.ok(schema.facts.length>20);
  assert.equal(run('estimate').error.code,'CONSENT_REQUIRED');
  assert.equal(run('estimate',{...request,consent:{...consent,user_confirmed:false}}).error.code,'CONSENT_VERSION_MISMATCH');
  assert.equal(run('interview',{consent,facts:{income:{interest:'0'}}}).error.code,'FACT_CONFIRMATION');
  assert.equal(run('estimate',{...request,consent:{...consent,version:'old'}}).error.code,'CONSENT_VERSION_MISMATCH');
});

test('typed handoff is explicit, validates rule versions and never restores consent or worksheet approval',()=>{
  const first=run('estimate',request);assert.equal(first.figures.balance_payable,'11200.00');
  assert.equal(first.persistence,'host_managed_case_handoff');assert.equal(first.case.format,'lk-tax-case-v1');
  assert.equal(first.case.consent,undefined);assert.equal(first.case.acknowledgement,undefined);
  assert.equal(run('estimate',{case:first.case}).error.code,'CONSENT_REQUIRED');
  assert.equal(run('estimate',{consent,case:first.case}).figures.balance_payable,'11200.00');
  assert.equal(run('estimate',{consent,case:{...first.case,ruleset_version:'obsolete'}}).error.code,'INVALID_REQUEST');
  const changed=run('interview',{consent,case:first.case,facts:{income:{interest:'0'}},facts_confirmed:true});
  assert.equal(first.case.facts.income.interest,'140000.00');assert.equal(changed.case.facts.income.interest,'0.00');
  assert.equal(run('interview',{consent}).confirmed_facts.income,undefined);
});

test('partial intake preserves unknowns and business preparation blocks every annual result',()=>{
  let r=run('interview',{consent,facts:{scope:{business_profit_needs_computation:true}},facts_confirmed:true});
  assert.equal(r.status,'blocked');assert.equal(r.calculation_ready,false);assert.deepEqual(r.questions,[]);
  for(const op of ['estimate','review','checklist','worksheet','preparation'])
    assert.equal(run(op,{consent,case:r.case}).error.code,'BUSINESS_PROFIT_REQUIRED');
  r=run('interview',{consent,facts:{income:{employment:'100'}},facts_confirmed:true});
  assert.equal(r.case.facts.income.interest,undefined);assert.equal(r.case.facts.income.apit_credit,undefined);
  assert.equal(run('estimate',{consent,case:r.case}).error.code,'MISSING_SCOPE_FACTS');
});

test('worksheet acknowledgement is current and complete, with no replay after edits',()=>{
  const estimate=run('estimate',request);const check=run('checklist',{consent,case:estimate.case});
  const acknowledgement={digest:check.digest,items:check.items.map((i:any)=>i.id),user_confirmed:true};
  assert.equal(run('worksheet',{consent,case:check.case}).error.code,'CHECKLIST_REQUIRED');
  assert.equal(run('worksheet',{consent,case:check.case,acknowledgement:{...acknowledgement,items:[]}}).error.code,'CHECKLIST_INCOMPLETE');
  const w=run('worksheet',{consent,case:check.case,acknowledgement});assert.ok(w.worksheet.includes('11200.00'));assert.equal(w.filing_ready,false);
  assert.equal(run('worksheet',{consent,case:w.case}).error.code,'CHECKLIST_REQUIRED');
  assert.equal(run('worksheet',{consent,case:w.case,facts:{income:{interest:'0'}},facts_confirmed:true,acknowledgement}).error.code,'CHECKLIST_STALE');
});

test('request errors never echo identifiers, arbitrary keys or malformed monetary input',()=>{
  for(const data of [{...request,nic:'SyntheticPrivateMarker'},{...request,facts:{income:{business_net:-12345}}},{...request,case:{...run('estimate',request).case,password:'SyntheticPrivateMarker'}}]){
    const r=run('estimate',data);assert.ok(r.error);assert.ok(!JSON.stringify(r).includes('SyntheticPrivateMarker'));
  }
  assert.equal(run('unknown-operation',request).error.code,'INVALID_REQUEST');
  assert.equal(run('normalize',{consent,value:'Rs. 1,200.00'}).canonical_amount,'1200.00');
  assert.equal(run('normalize',{consent,value:'-1200'}).error.code,'AMOUNT_FORMAT');
});

test('the complete tax skill runs in isolation without checkout modules or a server',t=>{
  const name='lk-tax-agent';
  const root=mkdtempSync(join(tmpdir(),'lk-tax-isolated-'));t.after(()=>rmSync(root,{recursive:true,force:true}));
  cpSync(new URL(`../skills/${name}`,import.meta.url),join(root,'skill'),{recursive:true});
  const script=join(root,'skill/scripts/tax.mjs');
  const run=(op:string,input:unknown)=>spawnSync(process.execPath,[script,op],{cwd:root,input:JSON.stringify(input),encoding:'utf8',env:{...process.env,NODE_PATH:'',LK_TAX_DOCUMENT_ROOT:undefined,LK_TAX_DRAFT_ROOT:undefined,LK_TAX_DRAFT_KEY_FILE:undefined}});
  const r=run('estimate',request);assert.equal(r.status,0,r.stderr);assert.equal(r.stderr,'');
  const result=JSON.parse(r.stdout);assert.equal(result.figures.balance_payable,'11200.00');assert.equal(result.filing_ready,false);
  const fresh=run('estimate',{consent});assert.equal(fresh.status,1);assert.equal(JSON.parse(fresh.stdout).error.code,'MISSING_SCOPE_FACTS');
  const invalid=spawnSync(process.execPath,[script,'estimate'],{cwd:root,input:'{invalid-private-input',encoding:'utf8'});
  assert.equal(invalid.status,1);assert.ok(!invalid.stdout.includes('invalid-private-input'));assert.equal(invalid.stderr,'');
 });
