# Supported scope and limits

## Versions and sources

The bundled calculation data came unchanged from source commit edc37c9f895f24c2d65f9029cb47fa72f69d3233. Source verification dates remain those recorded in the rules, primarily 19 October 2026. Packaging on 15 November 2026 does not reverify legislation, deadlines, current portal behavior or practitioner approval. Read source URLs, exact locators, rule versions and assumptions from the returned trace. Use current official IRD sources for a new legal question, but do not silently change the bundled calculator's rules or calculate an unsupported case from memory.

## Supported estimates

- YA 2025/26 resident-individual estimates: local employment, externally prepared local taxable business net profit, bank interest, gross investment rent, supported local reliefs/donations and informational resident-company dividends with supported final withholding already deducted.
- Separately supplied qualifying foreign-employer salary or net foreign services, already converted to LKR. Collect explicit foreign-currency, licensed-bank remittance, conversion and relevant employer/service-use confirmations. Foreign tax credits cover only eligible income tax on the same income from one confirmed source in one country, with both implemented caps. Never pool unrelated jobs and businesses or double-count foreign income locally.
- YA 2026/27 quarterly instalments through the supported methods. Collect current-year scope and credits independently. Never automatically reuse annual inputs, a net annual balance or prior-year APIT. An explicit Method 1 choice may match a supplied gross-tax basis to the current supported prior-year gross estimate; it does not verify the prior return.

## Stop and refer

Stop for special/nonresident circumstances, investment-asset gains, partnerships/trusts, special-rate business, retirement/termination benefits or arrears, loss claims, amendments/assessments/appeals, practitioner client preparation, unsupported income/claims, nonqualifying foreign income and multi-country foreign credits. If taxable business profit still needs preparation, stop at BUSINESS_PROFIT_REQUIRED even when someone supplies zero or a revenue figure. Resume only after the user confirms externally prepared taxable profit and corrects that outstanding-preparation fact. Do not work out taxable profit from receipts, fees, equipment or bank deposits within this skill.

Clarify whether an owner requests a personal or a company calculation. Company accounts, company tax and partnership returns are unsupported. Company sales, company profits and personal drawings are not personal taxable business profit. Supported personal salary/dividend estimates can be a separate case. The helper cannot prove a manually entered figure is correctly classified; the assistant and user must verify the classification.

## Unresolved review

Foreign-income local-first allocation/shared-band stacking, comparison interpretations and official rounding remain unreviewed. Donation-cap disagreements are refused. Complete refund entitlement, exempt and gross-remittance disclosures, credit/payment breakdowns, historical solar balances, assets/liabilities, declarations, portal eligibility and full filing outputs remain external. Do not submit returns, make payments, access RAMIS or ask for credentials.

Document extraction is conservative English-label review, not universal recognition or calibrated OCR confidence. Missing or ambiguous values require local confirmation, never a guessed zero. Do not claim host file extraction has the same automatic duplicate/provenance guarantees as the optional structured ledger. Local directories and native binaries must be trusted; this is not an OS sandbox.

A host with no executable runtime can organize records and explain preparation steps but cannot produce this calculator's validated estimates. Installing a skill does not confer unavailable file, terminal, browsing or durable-storage capabilities. Actual model behavior, installed-host presentation and independent human usability require their own tests.
