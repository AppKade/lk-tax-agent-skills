# Implementation status

Updated 15 November 2026. The skills-first migration and simplification are implemented. Tax support remains an unreviewed development preview.

## Delivered

- One self-contained skill with a concise entry point and focused references loaded when needed.
- One bundled calculator, requiring Node 22.18+ and no end-user npm install, connector or server.
- Explicit one-shot case handoff, strict aggregates, current consent and confirmation gates.
- Preserved deterministic annual calculations, foreign credits, reliefs, source/cage traces, quarterly planning and worksheets.
- Host-based selected-document review plus optional bounded local extraction, structured evidence decisions and provenance checks.
- Optional encrypted save/restore/delete without restoring consent or checklist approval.
- Preserved rule histories, synthetic fixtures, planning requirements, earlier validation records, complete Git bundle and fetched pull-request metadata.

## Still required before a filing-ready product

Qualified Sri Lankan tax review; resolution of foreign-income interpretations and official rounding; complete disclosures and official return output; native installed-host tests with independent nontechnical people; broader/multilingual document recognition; and release/distribution decisions. Bookkeeping, company tax, partnerships, loss claims and multi-country foreign credits remain unsupported. No skill can add execution/file capabilities the selected host does not expose.

The preserved requirements and backlog under history are planning history. Their unimplemented features and obsolete transport assumptions are not promises of current support. New skill workflows are authoritative for usage, while dated rule/source evidence remains authoritative for what the calculator implements.

## Simplification

The initial six folders repeated the same runtime and overlapping instructions. They are consolidated into lk-tax-agent, with all focused workflows preserved in its references. Consent and intake questions are generated from the runtime source, so ordinary conversation does not need disclaimer/schema/discovery invocations. Optional local extraction and encrypted storage are loaded only on request. Calculation code, tax rules and evidence safeguards are unchanged.
