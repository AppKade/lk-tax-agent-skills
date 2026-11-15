# Confirmed-fact questions

Read the relevant group while preparing a case in chat. Ask at most three ordinary questions at a time. Do not read field ids to the user, infer an unknown amount as zero or an absent boolean as false. Store amounts as decimal LKR strings. Confirm every value before supplying it to the calculator. This reference is generated from its actual field definitions.

## Contents

- scope
- income
- foreign
- deductions

## Dependencies

Confirm required scope answers unless a known exclusion stops the case. Optional legacy band/credit hints are derived by code and are intentionally omitted here. Stop if taxable business profit still needs preparation.

All income amounts, the three foreign monetary selectors and deductions need explicit confirmation, including zeros. After the foreign amounts are known: positive foreign income requires currency receipt, licensed-bank remittance and conversion confirmation; salary additionally requires the foreign-employer confirmation and services require use outside Sri Lanka. Positive foreign tax also requires credit eligibility and one-source/one-country confirmation. Skip only foreign booleans proven inapplicable from confirmed amounts; never guess the monetary selectors.

Use interview only when validating a prepared case, resolving dependency uncertainty or checking a correction. It reports current missing facts and any blocker; do not invoke a script for each ordinary answer.

## scope

- **scope.resident_full_year** (boolean): Were you resident in Sri Lanka throughout this year of assessment?
- **scope.residency_special_case** (boolean): Does your residency need special review, such as a move into or out of Sri Lanka during the year?
- **scope.investment_asset_gains** (boolean): Do you have gains from selling investment assets that need a capital-gains calculation?
- **scope.partnership_or_trust** (boolean): Do you have income allocated from a partnership or trust?
- **scope.restricted_business** (boolean): Do you have business income subject to special rates, such as betting, gaming, liquor or tobacco?
- **scope.terminal_benefits_or_arrears** (boolean): Did you receive retirement or termination benefits, or salary arrears?
- **scope.business_profit_needs_computation** (boolean): Do you need help calculating business net profit from receipts and expenses? This tool accepts only a net profit prepared outside it.
- **scope.losses** (boolean): Do you need to claim or carry forward a business or other tax loss?
- **scope.multiple_foreign_tax_countries** (boolean): Does your foreign income tax credit claim involve more than one country?
- **scope.amendment_assessment_or_appeal** (boolean): Is this an amendment to a filed return, an assessment dispute or an appeal?
- **scope.preparing_for_clients** (boolean): Are you preparing this estimate for a client rather than yourself?

## income

- **income.employment** (lkr_decimal_string): Your total local employment pay for this tax year before tax and employee deductions, including taxable bonuses and benefits. Use the annual taxable-employment certificate, not take-home pay. Exclude foreign salary entered separately and do not add an old certificate to its replacement.
- **income.business_net** (lkr_decimal_string): Local taxable business net profit prepared outside this tool, not revenue or bank deposits. Do not include foreign services entered separately. Losses and account preparation are unsupported.
- **income.interest** (lkr_decimal_string): Total taxable local bank interest for this year before the bank withheld tax. Use gross interest, not the net amount credited. We ask about the tax withheld separately.
- **income.rent** (lkr_decimal_string): Total local rental income before any expenses. Tell the assistant if you want to claim repairs or other rental expenses, which this preview cannot calculate.
- **income.final_wht_dividends_gross** (lkr_decimal_string): Total resident-company dividends before final tax already withheld. If final tax was not already deducted, tell the assistant so it can check whether the case is supported.
- **income.final_wht_dividends_deducted** (lkr_decimal_string): Actual final WHT deducted on these dividends. Informational only, never an advance tax credit.
- **income.apit_credit** (lkr_decimal_string): Tax already deducted or paid on your employment for this year, shown as APIT/PAYE on the employer certificate, including any separately paid Table 08 tax. Do not infer it from take-home pay or other employee deductions. If the tax amount is not stated, say it is unknown rather than zero. Exclude foreign income tax and duplicate certificates.
- **income.ait_wht_credit** (lkr_decimal_string): Eligible advance tax already withheld by your bank or another local payer for this year, shown as AIT/WHT on certificates. Exclude final dividend tax, foreign income tax and duplicate certificates. If it is not stated, say it is unknown rather than zero.
- **income.instalments_paid** (lkr_decimal_string): Actual income-tax instalments paid for this year from payment records. Exclude projected payments and payments for another year.
- **income.other_income_or_claims** (boolean): Do you have any other income or claim outside the supported categories, including unsupported or exempt income, rent expenses, other dividends or loan-funded solar claims? Do not omit genuine income to bypass a refusal.

## foreign

- **foreign.employment_lkr** (lkr_decimal_string): Annual foreign-employer salary already converted to LKR; do not include it again in local employment.
- **foreign.service_net_lkr** (lkr_decimal_string): Annual net foreign service business income already computed and converted to LKR; exclude it from local business_net.
- **foreign.foreign_tax_paid** (lkr_decimal_string): Eligible foreign income tax actually paid on this same qualifying income in ONE country. Exclude foreign VAT and Sri Lankan APIT.
- **foreign.received_in_foreign_currency** (boolean): Was this foreign income received in a foreign currency? Say if you are unsure; do not infer this just because the customer is overseas.
- **foreign.remitted_via_licensed_bank** (boolean): Was this income remitted to Sri Lanka through a licensed bank? Check the receipt records; an overseas invoice alone does not confirm this.
- **foreign.foreign_employer_confirmed** (boolean): Is this salary paid by a foreign employer? Do not classify freelance customer payments as an employment salary.
- **foreign.services_used_outside_lk** (boolean): Were the services used outside Sri Lanka? An overseas customer alone does not establish where the services were used.
- **foreign.fx_conversion_confirmed** (boolean): Have all foreign amounts already been converted to LKR using an independently checked conversion for the relevant records? This tool does not convert currencies.
- **foreign.credit_eligibility_confirmed** (boolean): Eligible income tax on the same YA income, paid within the statutory time limit or a permitted extension, with evidence.
- **foreign.single_source_confirmed** (boolean): The claimed foreign tax and ALL foreign income in this credit calculation belong to one source and one country; no pooling across jobs/businesses.

## deductions

- **deductions.solar_available** (lkr_decimal_string): Confirmed eligible expenditure remaining after all prior relief claims for panels on own premises connected to the national grid. Loan-funded claims are not supported.
- **deductions.approved_charity_cash** (lkr_decimal_string): Cash donations to approved charitable institutions only; exclude in-kind donations.
- **deductions.government_donations** (lkr_decimal_string): Eligible current-year donations to Government or qualifying specified institutions, including in-kind donations.
- **deductions.government_donations_brought_forward** (lkr_decimal_string): Only an eligible and independently verified Government-donation carry-forward under Annexure 3(f); legacy qualifying-payment balances are unsupported.
- **deductions.samurdhi_shop_contributions** (lkr_decimal_string): Confirmed eligible contributions to a shop for a female Samurdhi beneficiary, recommended and confirmed by the department.
