import { build } from 'esbuild';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root=fileURLToPath(new URL('..',import.meta.url));
const built=await build({absWorkingDir:root,entryPoints:['src/cli.ts'],bundle:true,platform:'node',target:'node22.18',format:'esm',write:false,minify:true,legalComments:'inline',metafile:true});
const inputs=Object.keys(built.metafile.inputs);
if(inputs.some(p=>p.includes('modelcontextprotocol')))throw new Error('Unexpected transport dependency');
const code=built.outputFiles[0].text;
const sha256=createHash('sha256').update(code).digest('hex');
const license=readFileSync(new URL('../node_modules/zod/LICENSE',import.meta.url),'utf8');
const projectLicense=readFileSync(new URL('../LICENSE',import.meta.url),'utf8');
const core=JSON.parse(readFileSync(new URL('../package.json',import.meta.url),'utf8'));
for(const skill of readdirSync(new URL('../skills',import.meta.url))){
 const base=new URL(`../skills/${skill}/`,import.meta.url);mkdirSync(new URL('scripts',base),{recursive:true});
 writeFileSync(new URL('scripts/tax.mjs',base),code);
 writeFileSync(new URL('references/third-party-notices.md',base),'# Project and third-party notices\n\n'+projectLicense+'\n\nThe standalone calculator includes Zod '+core.devDependencies.zod+' under its MIT license.\n\n'+license);
 writeFileSync(new URL('references/runtime-manifest.json',base),JSON.stringify({version:core.version,sha256,node:core.engines.node,annual_rules:'2025.26.3',instalment_rules:'2026.27.1',mapping:'2025.26.cages.1',runtime_dependencies:[],network_access:false},null,2)+'\n');
}
process.stdout.write(`Built six standalone skill helpers (${Buffer.byteLength(code)} bytes each), SHA-256 ${sha256}\n`);
