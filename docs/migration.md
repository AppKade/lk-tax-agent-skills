# Migration to tax agent skills

15 November 2026. The source calculation/evidence baseline is AppKade/lk-tax-mcp main at `edc37c9f895f24c2d65f9029cb47fa72f69d3233`. Compatible finalization work from unmerged PR 21 at `b8488f666b7da973197349b4659f7afc5fee8075` supplies the maintainer-selected MIT license and patched Zod 4.6.7. Transport-specific release changes were not adopted.

## Replacement architecture

Six independently installable skill folders guide the host's conversation. Each contains its own identical bundled one-shot Node helper, applicable code notices and focused references. There is no active MCP transport SDK, server, HTTP endpoint, JSON-RPC protocol, discovery resource, Inspector dependency, connector setup or old-repository download. The helper reads one typed request from stdin, returns a result and explicit case handoff, then exits.

The host handles plain-language intake, selected-document reading, explanation, conversational pacing and any user-requested artifact creation. It cannot calculate an unsupported case, infer missing facts or claim capabilities it lacks. The tested deterministic engine still calculates money and enforces supported scope, consent, evidence reconciliation, credit checks, draft authentication and worksheet acknowledgements. A host unable to execute the helper can organize preparation but cannot produce its estimate.

## Preservation map

| Previous work | New location/handling |
|---|---|
| Exact money, annual tax, reliefs, foreign credits, scope and interview dependencies | `src/` pure modules, unchanged hashes in `migration.json` |
| Quarterly arithmetic and administrative method checks | Preserved instalment module and focused planning skill |
| Evidence ledger, duplicate/year/revision decisions and bounded local extraction | Preserved modules; optional document operation plus host-based review instructions |
| Encrypted drafts and local key boundary | Preserved crypto/file adapter, explicit one-shot save/resume workflow |
| Return cages, current checklist and worksheets | Preserved review/worksheet modules, focused review skill |
| Consent and session workflow | New versioned skill privacy notice; strict typed case passed explicitly between processes |
| Public transport schemas/prompts/resources | Replaced by skill instructions and helper input schemas; no live legacy compatibility layer |
| Tax rule payloads and immutable revision history | `rules/`, unchanged, with existing governance tests |
| Original requirements/backlog and earlier user evaluations | `docs/history/`, labelled historical rather than current capability promises |
| Source commits and unmerged branch history | Complete `docs/history/source-history.bundle` |
| Fetched GitHub issues/PR/release metadata and bodies | `docs/history/github-export.json`; 21 issue records, all PRs, 21 PR records, no releases |

The history bundle is audit/recovery material. It contains the old source but is not imported, run or needed by any skill. It can be recovered with `git clone docs/history/source-history.bundle recovered-source`. Current skills and source code contain no dependency on that recovered repository. GitHub settings, credentials, CI logs/artifacts and all platform metadata are not a full service backup and are not recreated from this bundle.

## Behavior changes

A returned case is plain typed/redacted JSON, rather than a hidden long-running process session. It excludes consent and worksheet approval; a current conversation must supply actual agreement and a current checklist. Cases validate annual, mapping and instalment rule versions. A case whose edited totals need evidence reconciliation can reopen for repair while annual outputs remain blocked. New one-shot invocations cannot inherit prior-process facts.

Document uploads/readers now belong to the host and require explicit selected-file permission, with provider/retention exposure explained. The optional bounded adapter remains available where configured. Host extraction and a manual table do not automatically establish the adapter's provenance checks. Raw documents and arbitrary identifiers remain outside calculator inputs.

Review/checklist confirmation is deliberately passed for the exact current worksheet only. Reusing a returned case does not preserve an acknowledgement. Encrypted drafts require new conversation consent and restored-fact review; expiry still does not delete ciphertext automatically. All tax rules, arithmetic and unresolved legal interpretations remain unchanged.

## Retirement gate

Publish the replacement, verify its complete tree, recoverable history and passing validation before removing the old repository. Repository deletion is a separate GitHub action and must be checked live. This migration document alone does not assert that the old repository has been deleted.

See `validation.md` for executed coverage and `status.md` for remaining practitioner and installed-host acceptance work.
