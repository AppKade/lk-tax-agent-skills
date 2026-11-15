import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, cpSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DISCLAIMER_VERSION } from '../src/service.ts';
import local from '../test/fixtures/ird-local-2025-26.json' with { type:'json' };
import foreign from '../test/fixtures/ird-foreign-2025-26.json' with { type:'json' };
import { cleanScope, income, zeroDeductions, noForeign } from '../test/fixtures.ts';
import { instalmentInput } from '../test/instalment-fixture.ts';
const root=mkdtempSync(join(tmpdir(),'lk-tax-journeys-'));
try{
 cpSync(new URL('../skills/lk-tax-agent',import.meta.url),join(root,'skill'),{recursive:true});
 const script=join(root,'skill/scripts/tax.mjs');const observations:unknown[]=[];
 const consent={version:DISCLAIMER_VERSION,user_confirmed:true};
 function call(operation:string,input:unknown={}){
  const p=spawnSync(process.execPath,[script,operation],{cwd:root,input:JSON.stringify(input),encoding:'utf8',env:{...process.env,NODE_PATH:'',LK_TAX_DOCUMENT_ROOT:undefined,LK_TAX_DRAFT_ROOT:undefined,LK_TAX_DRAFT_KEY_FILE:undefined}});
  assert.equal(p.stderr,'');const result=JSON.parse(p.stdout);assert.equal(p.status,result.error?1:0);
  observations.push({operation,input,result});return result;
 }
 assert.ok(call('schema').operations.estimate);assert.equal(call('estimate').error.code,'CONSENT_REQUIRED');
 for(const c of [...local,...foreign]){
  const facts={scope:cleanScope,income:c.income,deductions:c.deductions,foreign:'foreign' in c?c.foreign:noForeign};
  const r=call('estimate',{consent,facts,facts_confirmed:true});assert.equal(r.error,undefined);
  for(const [key,value] of Object.entries(c.expected))assert.equal(r.figures[key],value,`${c.id}/${key}`);
  assert.equal(r.filing_ready,false);assert.equal(r.estimate,true);
  const review=call('review',{consent,case:r.case});assert.ok(review.checks.every((c:any)=>c.status==='passed'));
 }
 const facts={scope:cleanScope,income,deductions:zeroDeductions,foreign:noForeign};
 let r=call('interview',{consent,facts,facts_confirmed:true});assert.equal(r.calculation_ready,true);
 assert.equal(call('worksheet',{consent,case:r.case}).error.code,'CHECKLIST_REQUIRED');
 const checklist=call('checklist',{consent,case:r.case});
 const ack={digest:checklist.digest,items:checklist.items.map((x:any)=>x.id),user_confirmed:true};
 r=call('worksheet',{consent,case:checklist.case,acknowledgement:ack});assert.ok(r.worksheet.includes('11200.00'));
 assert.equal(call('worksheet',{consent,case:r.case,facts:{income:{interest:'0'}},facts_confirmed:true,acknowledgement:ack}).error.code,'CHECKLIST_STALE');
 const block=call('interview',{consent,facts:{scope:{business_profit_needs_computation:true}},facts_confirmed:true});
 assert.equal(block.blocking_error,'BUSINESS_PROFIT_REQUIRED');assert.equal(call('estimate',{consent,case:block.case}).error.code,'BUSINESS_PROFIT_REQUIRED');
 assert.equal(call('interview',{consent,facts:{scope:{partnership_or_trust:true}},facts_confirmed:true}).blocking_error,'OUT_OF_SCOPE');
 assert.equal(call('interview',{consent,facts:{foreign:{service_net_lkr:'6000000',remitted_via_licensed_bank:false}},facts_confirmed:true}).blocking_error,'FOREIGN_ELIGIBILITY_REVIEW');
 const instalments=call('instalments',{consent,plan:instalmentInput});assert.equal(instalments.figures.instalment_payable,'67500.00');
 const saved=call('draft',{consent,case:checklist.case,draft:{action:'save',slot:'draft_1',user_confirmed:true}});assert.equal(saved.error.code,'DRAFT_FEATURE_DISABLED');
 const out=new URL('../artifacts/',import.meta.url);const {mkdirSync}=await import('node:fs');mkdirSync(out,{recursive:true});
 writeFileSync(new URL('journey-observations.json',out),JSON.stringify(observations,null,2)+'\n');
 process.stdout.write(`${observations.length} one-shot requests passed, including all six IRD annual examples, worksheet recovery, exclusions and instalments.\n`);
}finally{rmSync(root,{recursive:true,force:true});}
