import { z } from 'zod';
import { TaxSession, DISCLAIMER_VERSION, partialFactsSchema, caseSchema, documentActionSchema, draftActionSchema, envelope, errorResult } from './service.ts';
import { figureNames } from './engine.ts';
import { factDictionary, interviewPolicy } from './interview.ts';
import { instalmentSchema } from './instalments.ts';
import { assertPrivateOutput } from './privacy.ts';

const consentSchema = z.strictObject({ version:z.string().max(30), user_confirmed:z.boolean() });
const common = { consent:consentSchema.optional(), case:caseSchema.optional(), facts:partialFactsSchema.optional(), facts_confirmed:z.boolean().optional() };
const base=z.strictObject(common);
export const operations = {
  disclaimer:z.strictObject({}), capabilities:z.strictObject({}), schema:z.strictObject({}),
  interview:base, estimate:base, review:base, checklist:base,
  normalize:z.strictObject({...common,value:z.string().min(1).max(60)}),
  explain:z.strictObject({...common,line:z.enum(figureNames)}),
  worksheet:z.strictObject({...common,acknowledgement:z.strictObject({digest:z.string().regex(/^[a-f0-9]{64}$/),items:z.array(z.string().max(70)).max(20),user_confirmed:z.boolean()}).optional()}),
  preparation:z.strictObject({...common,completed:z.array(z.string().regex(/^[A-Z_]{1,50}$/)).max(20).default([]),user_confirmed:z.boolean().default(false)}),
  document:z.strictObject({...common,document:documentActionSchema}),
  draft:z.strictObject({...common,draft:draftActionSchema}),
  instalments:z.strictObject({...common,plan:instalmentSchema}),
};
export type Operation = keyof typeof operations;
// The helper is a one-shot function, with no listening socket, RPC transport or hidden session state.
export function runAgent(operation:string,input:unknown) {
  const context=operation==='instalments'?'instalments': ['review','worksheet','checklist','preparation'].includes(operation)?'review':'annual';
  try {
    if(!Object.hasOwn(operations,operation)) throw new Error('INVALID_REQUEST');
    const schema=operations[operation as Operation];const p=schema.safeParse(input);
    if(!p.success)throw new Error('INVALID_REQUEST');
    const s=new TaxSession();
    if(operation==='disclaimer')return envelope(s.disclaimer());
    if(operation==='capabilities')return envelope({...s.localCapabilities(),execution:'one_shot',persistence:'host_managed_case_handoff',
      instructions:'Use the returned case in the next invocation. It is not an encrypted save. Never store it without permission. Consent and worksheet approval are not carried in a case.'});
    if(operation==='schema')return envelope({facts:factDictionary,policy:interviewPolicy,
      operations:Object.fromEntries(Object.entries(operations).map(([k,v])=>[k,z.toJSONSchema(v,{io:'input'})])),disclaimer_version:DISCLAIMER_VERSION});
    const data=p.data as z.infer<typeof base> & Record<string,any>;
    s.start('2025/26');
    if(!data.consent)throw new Error('CONSENT_REQUIRED');
    s.accept(data.consent.version,data.consent.user_confirmed);
    if(data.case)s.importCase(data.case);
    if(data.facts){if(data.facts_confirmed!==true)throw new Error('FACT_CONFIRMATION');s.setFacts(data.facts);}
    let result:Record<string,unknown>;
    switch(operation) {
      case 'interview':result=s.nextQuestions();break;
      case 'estimate':result=s.compute();break;
      case 'review':result=s.review();break;
      case 'checklist':result=s.checklist();break;
      case 'normalize':result=s.normalizeAmount(data.value);break;
      case 'explain':result=s.explain(data.line);break;
      case 'worksheet':
        if(data.acknowledgement)s.acknowledgeChecklist(data.acknowledgement.digest,data.acknowledgement.items,data.acknowledgement.user_confirmed);
        result=s.worksheet();break;
      case 'preparation':result=s.preparation(data.completed,data.user_confirmed);break;
      case 'document':result=s.documents(data.document);break;
      case 'draft':result=s.draft(data.draft);break;
      case 'instalments':result=s.planInstalments(data.plan);break;
      default:throw new Error('INVALID_REQUEST');
    }
    const output=envelope({...result,persistence:'host_managed_case_handoff',case:s.exportCase()},context);
    assertPrivateOutput(output);return output;
  }catch(error){return errorResult(error,context);}
}
