import test from 'node:test';
import assert from 'node:assert/strict';
import { TaxSession, DISCLAIMER_VERSION, envelope } from '../src/service.ts';
import { instalmentInput } from './instalment-fixture.ts';
import { cleanScope, zeroDeductions } from './fixtures.ts';
import { assertPrivateOutput } from '../src/privacy.ts';

// Synthetic document journey: revised salary certificate, two bank letters, no identifiers.
const { foreign_credit_exceeds_cap: _credit, qualifying_foreign_income: _foreign, local_taxable_below_first_band: _band, ...scope } = cleanScope;
const income = { employment: '2010000', business_net: '0', interest: '170000', rent: '0',
  final_wht_dividends_gross: '0', final_wht_dividends_deducted: '0', apit_credit: '0', ait_wht_credit: '17000',
  instalments_paid: '0', other_income_or_claims: false };
const foreign = { employment_lkr: '0', service_net_lkr: '0', foreign_tax_paid: '0' };
const facts = { scope, income, foreign, deductions: zeroDeductions };
function ready() {
  const s = new TaxSession(); s.start('2025/26'); s.accept(DISCLAIMER_VERSION, true); s.setFacts(facts); return s;
}
function acknowledge(s: TaxSession) { const c = s.checklist(); s.acknowledgeChecklist(c.digest, c.items.map(i => i.id), true); }

test('real exclusions remain explicit while derived scope hints are never requested or saved', () => {
  const s = new TaxSession(); s.start('2025/26'); s.accept(DISCLAIMER_VERSION, true);
  const p = s.nextQuestions();
  assert.equal(p.missing_facts.length, 11);
  assert.equal(p.questions.length, p.missing_facts.length);
  assert.ok(p.questions.every(q => q.question.length > 20));
  assert.ok(!p.missing_facts.includes('scope.local_taxable_below_first_band'));
  assert.deepEqual(p.confirmed_facts, {});
  s.setFacts(facts);
  assert.equal(s.compute().figures.balance_payable, '5800.00');
  assert.equal(s.nextQuestions().confirmed_facts.scope?.local_taxable_below_first_band, undefined);
  s.setFacts({ foreign: { service_net_lkr: '3600000', received_in_foreign_currency: true,
    remitted_via_licensed_bank: true, fx_conversion_confirmed: true, services_used_outside_lk: true } });
  assert.ok(s.compute().flags.includes('INTERP_15PCT')); // Still derived despite no triage hints.
  const incomplete = ready();
  incomplete.start('2025/26'); incomplete.accept(DISCLAIMER_VERSION, true);
  const { losses: _losses, ...missingScope } = scope;
  incomplete.setFacts({ ...facts, scope: missingScope });
  assert.throws(() => incomplete.compute(), /MISSING_SCOPE_FACTS/);
});

test('confirmed fact review preserves missingness, normalizes money and cannot mutate the session', () => {
  const s = new TaxSession(); assert.throws(() => s.nextQuestions(), /SESSION_REQUIRED/);
  s.start('2025/26'); assert.throws(() => s.nextQuestions(), /CONSENT_REQUIRED/); s.accept(DISCLAIMER_VERSION, true);
  s.setFacts({ income: { employment: '2010000' } });
  const p = s.nextQuestions();
  assert.equal(p.confirmed_facts.income?.employment, '2010000.00');
  assert.equal(p.confirmed_facts.income?.interest, undefined);
  p.confirmed_facts.income!.employment = '1';
  assert.equal(s.nextQuestions().confirmed_facts.income?.employment, '2010000.00');
  assert.doesNotThrow(() => assertPrivateOutput(envelope(s.nextQuestions())));
  s.wipe(); assert.throws(() => s.nextQuestions(), /SESSION_REQUIRED/);
});

test('credit anomalies survive computation, review, summary and worksheet and require a specific acknowledgement', () => {
  const s = ready();
  assert.deepEqual(s.compute().input_warnings, []);
  s.setFacts({ income: { apit_credit: '3000000' } });
  const c = s.compute();
  assert.equal(c.figures.potential_overpayment, '2994200.00'); // No invented credit cap.
  assert.equal(c.input_warnings[0].code, 'APIT_EXCEEDS_REPORTED_EMPLOYMENT');
  assert.ok(c.display_summary.includes('APIT_EXCEEDS_REPORTED_EMPLOYMENT'));
  assert.ok(s.review().review_gaps.some(g => g.code === 'APIT_EXCEEDS_REPORTED_EMPLOYMENT'));
  const check = s.checklist();
  assert.ok(check.items.some(i => i.id === 'evidence_reconciled'));
  assert.throws(() => s.acknowledgeChecklist(check.digest, check.items.filter(i => i.id !== 'credit_anomalies_reconciled').map(i => i.id), true), /CHECKLIST_INCOMPLETE/);
  acknowledge(s); assert.ok(s.worksheet().worksheet.includes('APIT_EXCEEDS_REPORTED_EMPLOYMENT'));
  s.setFacts({ income: { apit_credit: '0' } });
  assert.deepEqual(s.compute().input_warnings, []);
  assert.throws(() => s.worksheet(), /CHECKLIST_REQUIRED/);
  s.setFacts({ income: { employment: '0', interest: '0', ait_wht_credit: '1' } });
  assert.deepEqual(s.compute().input_warnings.map(w => w.code), ['AIT_WHT_EXCEEDS_REPORTED_INCOME', 'CREDITS_WITHOUT_REPORTED_INCOME']);
  s.setFacts({ income: { employment: '0', interest: '100', ait_wht_credit: '10', instalments_paid: '1000' } });
  assert.deepEqual(s.compute().input_warnings, []); // Overpayment alone is not an anomaly.
});

test('identical normalized re-confirmation preserves checklist approval; actual changes and consent still invalidate', () => {
  const s = ready(); acknowledge(s);
  const digest = s.checklist().digest;
  for (const patch of [{}, { income: {} }, { income: { interest: '170000.0' } }, facts]) {
    s.setFacts(patch); assert.equal(s.worksheet().checklist_digest, digest);
  }
  assert.throws(() => s.setFacts({ income: { interest: '170,000' } }), /INVALID_FACTS/);
  assert.ok(s.worksheet());
  s.setFacts({ income: { interest: '170001' } }); assert.throws(() => s.worksheet(), /CHECKLIST_REQUIRED/);
  acknowledge(s); s.accept(DISCLAIMER_VERSION, true); assert.throws(() => s.worksheet(), /CHECKLIST_REQUIRED/);
});

test('instalment source selection refuses net payable and rechecks opted-in Method 1 against current gross tax', () => {
  const s = ready();
  const plan = { ...instalmentInput, quarter: 2, scope, gross_tax_basis: '22800', basis_source: 'session_annual_gross_tax',
    prior_instalments_paid: '1450', ait_wht_already_deducted: '8500', ait_wht_expected_remaining: '8500' };
  const p = s.planInstalments(plan);
  assert.equal(p.figures.instalment_payable, '1450.00'); assert.equal(p.basis_validation.matched_session_gross_tax, true);
  assert.equal(p.basis_validation.evidence_verified, false);
  assert.throws(() => s.planInstalments({ ...plan, gross_tax_basis: '5800' }), /INSTALMENT_BASIS_REVIEW/);
  assert.throws(() => s.planInstalments({ ...plan, basis_source: 'annual_net_balance', gross_tax_basis: '5800' }), /INSTALMENT_BASIS_REVIEW/);
  const { basis_source: _source, ...noSource } = plan;
  assert.throws(() => s.planInstalments(noSource), /INVALID_INSTALMENT_FACTS/);
  assert.throws(() => s.planInstalments({ ...plan, basis: { method: '2_iv', first_year_new_taxpayer: true } }), /INSTALMENT_BASIS_REVIEW/);
  s.setFacts({ income: { interest: '170001' } });
  assert.throws(() => s.planInstalments(plan), /INSTALMENT_BASIS_REVIEW/);
  s.setFacts({ income: { interest: '170000', apit_credit: '3000000' } });
  assert.throws(() => s.planInstalments(plan), /INSTALMENT_BASIS_REVIEW/);
  // External values stay explicitly unverified, never silently compared or copied.
  assert.equal(s.planInstalments({ ...plan, basis_source: 'external_gross_tax' }).basis_validation.matched_session_gross_tax, false);
});
