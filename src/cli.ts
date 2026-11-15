#!/usr/bin/env node
import { runAgent, operations } from './agent.ts';
import { errorResult } from './service.ts';
const operation=process.argv[2];
if(operation==='--help' || operation==='-h') {
  process.stdout.write('Sri Lanka tax skill helper. Node >=22.18.0.\nUsage: node tax.mjs <operation> < request.json\nOperations: '+Object.keys(operations).join(', ')+'\nJSON goes through stdin, never a command-line argument. No server or background process.\n');
}else {
  let bytes=0;const chunks:Buffer[]=[];let failed=false;
  try{
    for await(const chunk of process.stdin){const b=Buffer.from(chunk);bytes+=b.length;if(bytes>1048576)throw new Error('INVALID_REQUEST');chunks.push(b);}
    const text=Buffer.concat(chunks).toString('utf8');const input=text.trim()?JSON.parse(text):{};
    const result=runAgent(operation??'',input);process.stdout.write(JSON.stringify(result)+'\n');
    if('error' in result)process.exitCode=1;
  }catch{failed=true;process.stdout.write(JSON.stringify(errorResult(new Error('INVALID_REQUEST')))+'\n');process.exitCode=1;}
  finally{for(const b of chunks)b.fill(0);}
}
