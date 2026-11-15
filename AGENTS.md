# Contribution instructions

Build self-contained Sri Lankan tax preparation skills. Keep the calculator independent of conversational hosts. Never reintroduce a server, connector, transport SDK or a dependency on the retired repository.

- Keep money as canonical decimal strings at boundaries and bigint cents internally. Let tested code calculate; skills must not invent tax arithmetic or copy rates into instructions.
- Preserve missingness, explicit zero/boolean confirmations, current consent and evidence/year/duplicate/revision checks. Never hide a genuine unsupported claim to obtain a result.
- Keep every result an unreviewed development estimate with filing_ready false unless qualified review is actually recorded. Official rounding, unresolved interpretations and complete filing remain external.
- Source calculator/evidence modules and rule JSON migrated unchanged are recorded in docs/migration.json. Intentional changes must update that provenance record honestly, add meaningful tests and follow docs/rules-governance.md for rule changes. Do not rewrite archived rule payloads.
- Skills must be independently usable after copying a complete folder. Resolve resources relative to that SKILL.md; do not assume sibling names, a checkout cwd, network access, npm installation or an executable host. Without execution, organize preparation only.
- Pass a typed case explicitly between one-shot invocations. It is not an encrypted save. Do not carry consent/checklist approval into a restored conversation. Changes invalidate review and acknowledgements.
- Never use real taxpayer records in tests. Do not expose identifiers, raw document text, keys, paths or subprocess diagnostics in helper results. Host files/chat and provider retention remain separate privacy boundaries.
- Run npm run check, npm run build, npm run skills:check, npm run rules:check, npm test and the standalone journeys. Run the native document gate after changes to extraction, case handoff, drafts or their bundling. Keep generated helpers, manifests and notices in step.
- Use the configured maintainer/Codex Git identity. Never author as another vendor or rewrite published history. Push/merge only when the user authorizes it.
