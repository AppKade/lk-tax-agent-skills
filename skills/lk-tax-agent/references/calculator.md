# Deterministic calculation and validation

## When to execute

Use chat and facts.md for routine questions. Use this helper for a supported estimate, deterministic readiness check, changed-fact validation, trace explanation, official-cage review, worksheet or instalment arithmetic. Use local-files.md only for explicitly requested optional local operations. Ordinary intake, document reading and output formatting do not need separate scripts.

Read consent.md and obtain current agreement first. Static consent and question references are generated from the same source as the helper. Run `disclaimer` or `schema` only if an exact runtime check or additional schema detail is needed. Run `capabilities` only before offering configured local extraction/encrypted slots; it is not a mandatory starting call.

## Invoke

Resolve `<SKILL_DIR>` to this skill's actual directory. Run `node "<SKILL_DIR>/scripts/tax.mjs" <operation>` under Node 22.18+ with one strict JSON object on stdin. Dependencies and rule data are bundled. No npm install, server, connector, sibling folder or repository cwd is needed. Keep private values out of shell interpolation/arguments. Prefer direct stdin; remove any necessary private temporary input file afterwards. If the host cannot run it, do not produce a tax figure or claim execution succeeded.

For example, the host constructs this shape internally, never asks the user to write it:

```json
{
  "consent": {"version": "<current version in consent.md>", "user_confirmed": true},
  "facts_confirmed": true,
  "facts": {
    "scope": {"resident_full_year": true}
  }
}
```

Use only actual confirmed values. Omit uncollected fields; do not copy example answers into a real case. Use facts.md for field descriptions and `schema` for strict operation definitions when needed.

## Case handoff

The helper exits after each request and has no hidden session. A successful financial operation returns a typed `case`; pass it unchanged as `case` in the next invocation, with actual current consent. Add only newly confirmed `facts` and `facts_confirmed: true` when changing answers. Amounts must be nonnegative decimal LKR strings, not JSON numbers. Arbitrary narrative/identifiers are refused.

Keep the case in the current conversation. It is plain JSON, not an encrypted saved draft or permission to retain it permanently. A new conversation may lose it. Review restored or interrupted work with the user, and recompute after corrections. Consent and worksheet approval are not part of a case.

## Select an operation

| Operation | Use | Extra fields |
|---|---|---|
| interview | Validate current confirmed facts/dependencies or a correction; inspect missing questions, blockers and evidence progress | Optional confirmed facts patch |
| estimate | Compute after intake and source reconciliation | None |
| normalize | Propose an unambiguous copied LKR value when needed; confirm before applying | value |
| explain | Explain a current returned trace line | line |
| review / preparation | Recompute review gaps; record only explicitly confirmed external step ids | preparation optionally accepts completed and user_confirmed |
| checklist / worksheet | Show all current statements, then generate only after explicit acceptance | worksheet requires acknowledgement with current digest, accepted item ids and user_confirmed |
| instalments | Compute a separately confirmed current-year plan | plan following its schema |
| document / draft | Optional local features only; see local-files.md | document or draft action |
| disclaimer / schema / capabilities | Optional discovery when exact text/schema/local configuration is needed | Empty object; no consent required |

Financial operations require current `consent`. Do not manufacture agreement or repeat the consent question for unchanged facts within the same agreed conversation. Stop on `error.code` and explain `error.message`; errors exit nonzero and do not echo the input. Never estimate around a refusal. An incomplete intake is not a provisional estimate.

## Present the result

Show display_summary verbatim and include all flags, suspicious-credit warnings and comparison alternatives. Do not choose a legal interpretation. Use the returned trace to explain figures, without recalculating in the model. Review/checklist/worksheet must use the current case; acknowledgement cannot be replayed after edits or restore. User-reported external completion is not practitioner verification. Preserve estimate and filing-ready false and leave null cage values unset.
