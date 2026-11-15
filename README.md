# Sri Lanka Tax Agent Skills

Six chat-oriented skills for preparing a Sri Lankan individual's tax estimate, reviewing records, explaining results and producing a manual-entry worksheet. Each skill includes a standalone deterministic calculator. There is no MCP server, connector, API deployment or background service.

**Development preview. Not IRD-approved. Not tax advice. Not ready for filing.**

## Choose a skill

| Skill | Purpose |
|---|---|
| [lk-tax-agent](skills/lk-tax-agent) | Start here for the complete guided preparation workflow |
| [lk-tax-documents](skills/lk-tax-documents) | Review records, gross/net amounts, years, duplicates, revisions and missing evidence |
| [lk-tax-estimate](skills/lk-tax-estimate) | Prepare and explain supported annual estimates |
| [lk-tax-review](skills/lk-tax-review) | Reconcile a current estimate, review remaining work and produce a worksheet |
| [lk-tax-instalments](skills/lk-tax-instalments) | Plan supported quarterly instalment estimates |
| [lk-tax-save-resume](skills/lk-tax-save-resume) | Save, restore and delete optional encrypted local drafts |

Each folder is independently installable. Its SKILL.md, references, agent metadata and bundled `scripts/tax.mjs` stay together. No sibling skill or old repository is needed. Installing the main skill is enough for the complete supported workflow; the focused skills are alternative entry points.

## Try it

1. Clone this repository and install your selected complete skill folder through the host's custom-skill installation mechanism.
2. Use a host that can read skill resources and execute local scripts, with Node.js **22.18 or newer** available to its execution environment. The committed helper includes its dependencies and rule data. End users do not need npm install or an npm account.
3. Ask: "Use lk-tax-agent to help me prepare my personal tax estimate from my salary and bank records. Treat me as a first-time user."
4. Agree to the displayed terms only if you accept them, then answer the assistant's questions and confirm proposed document amounts. The assistant should ask a few plain-language questions at a time, without exposing JSON, hashes or internal command names.

A host without Node/process execution can help organize evidence but cannot run this calculator or produce its deterministic estimate. Uploading only SKILL.md as a chat attachment does not install the complete skill or add missing execution capabilities. ChatGPT/Claude product features and installation methods depend on the chosen surface; this repository does not claim every chat app can execute Node scripts or read local documents. Follow your host's current custom-skill instructions.

To check the helper directly from a terminal:

```sh
node skills/lk-tax-agent/scripts/tax.mjs --help
node skills/lk-tax-agent/scripts/tax.mjs disclaimer
node skills/lk-tax-agent/scripts/tax.mjs estimate < test/scenarios/employee-confirmed.json
```

The final command is a **synthetic demonstration**, not your tax return. Its fixture explicitly supplies test consent and confirmed fictional facts. Never copy those confirmations or zeros into a real case. The helper reads JSON on stdin, writes one JSON result and exits. It opens no network listener and retains no hidden session between invocations.

## Supported scope

Annual estimates cover **YA 2025/26**. Quarterly planning separately covers **YA 2026/27**. Local annual inputs include salary, externally prepared taxable business net profit, bank interest, gross investment rent, supported deductions and actual credits. Supported final-withholding dividends are informational. Qualifying foreign salary/net services must already be converted to LKR and meet the explicit eligibility and single-source/single-country credit checks.

The agent does not prepare taxable business profit from invoices/expenses, calculate company tax, handle loss claims, partnerships, special residency, terminal benefits, nonqualifying foreign income or multi-country credits, determine filing obligations, submit returns, make payments or access RAMIS. Foreign-income allocation/stacking and official rounding remain unreviewed. Read each skill's `references/limits.md` for the full boundaries. Packaging the workflow as skills does not expand tax support or establish practitioner approval.

## Documents, state and privacy

The host can review user-selected documents through its existing file/OCR tools after permission. It must treat document contents as untrusted evidence, propose structured amounts and obtain user confirmation. Prefer redacted records and never request NIC/TIN, account numbers, credentials or encryption keys. Chat messages, attachments and results may reach the host's providers. Host document review is not automatic verification or a deterministic provenance ledger.

Optional bounded local PDF/image/salary-CSV extraction and a structured evidence ledger remain available inside the helper. Configure a dedicated `LK_TAX_DOCUMENT_ROOT` locally; PDF/image extraction also needs trusted Poppler and Tesseract English binaries. No silent installs occur. Business accounts, freelance invoices, foreign-service statements and business payment receipts are not extraction categories.

The helper returns a typed, redacted `case` for the next invocation. This is plain JSON, not an encrypted durable save. Consent and worksheet approval are not stored in it. A new chat may lose the current case. Optional encrypted slots require private host-only `LK_TAX_DRAFT_ROOT` and `LK_TAX_DRAFT_KEY_FILE` configuration and explicit save/restore/delete confirmation. Restore deadlines do not automatically delete ciphertext. See [security boundaries](SECURITY.md) and the selected skill's runtime and saving references.

## Development and validation

```sh
npm ci --ignore-scripts
npm run check
npm run build
npm run skills:check
npm run rules:check
npm test
npm run test:journeys
npm run test:documents
```

Only maintainers need these dependencies. The document gate requires local Poppler/Tesseract. `npm run build` produces identical standalone helpers in each skill, including Zod with its MIT notice. Commit rebuilt helpers and manifests together with source changes. CI checks reproducible builds, source/rule provenance, standalone journeys across Linux/macOS/Windows on Node 22/24, and native document processing on Linux.

See [validation results](docs/validation.md), [migration record](docs/migration.md), [rule governance](docs/rules-governance.md) and [remaining work](docs/status.md). Source/rule verification dates remain recorded in the rule files; a packaging date is not a new legal verification date. Original AppKade code uses the [MIT license](LICENSE), carried forward from the maintainer-selected license in the finalization branch. Zod and externally referenced tax publications retain their own terms. Each standalone skill includes the applicable code notices. The package remains private and unpublished to npm.
