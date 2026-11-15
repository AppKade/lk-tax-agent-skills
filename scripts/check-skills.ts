import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { DISCLAIMER, DISCLAIMER_VERSION } from '../src/service.ts';
import { factDictionary } from '../src/interview.ts';
const names=['lk-tax-agent'];
assert.deepEqual(readdirSync('skills').sort(),[...names].sort());
let bundleHash:string|undefined;
for(const name of names){
 const root=join('skills',name),body=readFileSync(join(root,'SKILL.md'),'utf8');
 const front=body.match(/^---\n([\s\S]*?)\n---\n/);assert.ok(front,`${name}: frontmatter`);
 const keys=front[1].split('\n').filter(Boolean).map(l=>l.split(':')[0]);assert.deepEqual(keys,['name','description']);
 assert.ok(front[1].includes(`name: ${name}\n`));
 const description=front[1].match(/^description: (.+)$/m)?.[1];assert.ok(description&&description.length<=1024);
 assert.ok(body.split('\n').length<500);assert.ok(!/TODO|\u2014/.test(body));
 assert.ok(body.includes('explicit agreement'));assert.ok(body.includes('bundled'));
 const consent=readFileSync(join(root,'references/consent.md'),'utf8');assert.ok(consent.includes(DISCLAIMER_VERSION));assert.ok(consent.includes(DISCLAIMER));
 const questions=readFileSync(join(root,'references/facts.md'),'utf8');
 for(const f of factDictionary.filter(f=>f.required_by_schema)){assert.ok(questions.includes(f.path));assert.ok(questions.includes(f.description));}
 assert.deepEqual(readdirSync(join(root,'scripts')),['tax.mjs']);
 for(const ref of body.matchAll(/\]\((references\/[^)]+)\)/g))assert.ok(statSync(join(root,ref[1])).isFile(),`${name}: missing ${ref[1]}`);
 const runtime=readFileSync(join(root,'scripts/tax.mjs'));
 const hash=createHash('sha256').update(runtime).digest('hex');
 const manifest=JSON.parse(readFileSync(join(root,'references/runtime-manifest.json'),'utf8'));assert.equal(hash,manifest.sha256);
 assert.deepEqual(manifest.runtime_dependencies,[]);assert.equal(manifest.network_access,false);
 assert.ok(!runtime.toString().includes('@modelcontextprotocol'));
 bundleHash=hash;
 assert.ok(readFileSync(join(root,'references/third-party-notices.md'),'utf8').includes('MIT'));
}
const pkg=JSON.parse(readFileSync('package.json','utf8'));const lock=readFileSync('package-lock.json','utf8');
assert.ok(!lock.includes('modelcontextprotocol'));assert.equal(pkg.dependencies,undefined);assert.equal(pkg.bin,undefined);
for(const f of readdirSync('src')){
 const text=readFileSync(join('src',f),'utf8');
 assert.ok(!/modelcontextprotocol|serveStdio|server\/discover|tools\/call|lktax:\/\//.test(text),`obsolete transport in ${f}`);
 assert.ok(!/from ['"]node:(?:http|https|net|tls|dgram)['"]|\bfetch\s*\(|new\s+WebSocket/.test(text),`runtime network capability in ${f}`);
}
const migration=JSON.parse(readFileSync('docs/migration.json','utf8'));
for(const r of migration.unchanged_calculation_and_evidence_files)assert.equal(createHash('sha256').update(readFileSync(r.path)).digest('hex'),r.sha256,`source drift: ${r.path}`);
assert.equal(createHash('sha256').update(readFileSync('docs/history/source-history.bundle')).digest('hex'),migration.history_bundle_sha256);
process.stdout.write(`Validated one self-contained skill/helper, generated references, unchanged source/rule provenance and no transport/network dependency. Runtime SHA-256 ${bundleHash}\n`);
