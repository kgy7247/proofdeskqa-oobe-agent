# ProofDeskQA Demo Walkthrough

This is the public walkthrough for the OOBE x Ace Data Cloud bounty package.

## What The Agent Does

ProofDeskQA is an evidence-first autonomous QA agent that scouts earning opportunities, selects SAP-compatible tools, runs bounded AI service calls, and records an x402-compatible payment ledger.

The local workflow demonstrates:

- trigger to execution to payment trace
- SAP-compatible tool discovery
- three Ace Data Cloud style service calls
- one Synapse Sentinel style review
- x402-compatible ledger rows for every tool call
- settlement wallet routing to `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`

## Run The Demo

```powershell
npm install
$env:PUBLIC_REPO_URL='https://github.com/kgy7247/proofdeskqa-oobe-agent'
$env:PUBLIC_DEMO_URL='https://github.com/kgy7247/proofdeskqa-oobe-agent/blob/main/docs/demo-walkthrough.md'
npm run bounty:oobe:demo
npm run bounty:oobe:ready
npm run bounty:oobe:report
```

## Evidence Files

- `output/oobe-agent-run.json`: machine-readable execution trace.
- `output/oobe-live-readiness.json`: dependency and live credential readiness check.
- `output/oobe-submission-report.md`: human-readable bounty evidence report.

## Current Scope

This public walkthrough proves the workflow shape and audit trail. It does not claim live mainnet volume. Final paid submission still needs live SAP mainnet registration evidence, live Ace Data Cloud account/API key, and live x402 facilitator or escrow transaction hashes.
