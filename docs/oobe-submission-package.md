# OOBE x Ace Data Cloud Submission Package

Status checked: 2026-06-02

## Listing

- Listing: `Autonomous Agent Bounty: OOBE x Ace Data Cloud`
- URL: `https://superteam.fun/earn/listing/autonomous-agent-bounty-oobe-ace-data-cloud/`
- Prize pool: `2,400 USDC`
- Public search snapshot on 2026-06-02 showed the listing as open/global with a `2,400 USDC` prize pool. Submission count and remaining time are live fields and should be rechecked immediately before final submission.

## Relevant Requirements

The listing asks for an autonomous on-chain agent that can:

- Discover tools via Synapse Agent Protocol (SAP)
- Execute tasks using Ace Data Cloud and other AI services
- Settle payments using x402 payment workflows, either on-chain escrow or Ace Data Cloud facilitator
- Run from trigger to execution to payment without manual input

General Payment Volume category:

- SAP mainnet agent registration
- Complete automated workflow
- Escrow payments with Synapse RPC
- At least one AI capability
- Use Synapse Sentinel at least once

Ace Data Cloud category:

- SAP mainnet agent registration
- Complete automated workflow
- Ace Data Cloud account
- x402 with Ace Data Cloud facilitator and Synapse RPC
- At least 3 distinct Ace Data Cloud services

## Current Local Demo

Run:

```powershell
npm run bounty:oobe:demo
npm run bounty:oobe:ready
npm run bounty:oobe:report
```

Output:

```text
output/oobe-agent-run.json
```

The demo produces a deterministic trigger -> discovery -> execution -> payment trace:

- Three Ace Data Cloud style services:
  - `ace.search.web`
  - `ace.summarize.brief`
  - `ace.risk.classify`
- One Synapse Sentinel style service:
  - `synapse.sentinel.review`
- One x402-compatible payment ledger entry per call

## Submission Draft

```text
ProofDeskQA is an evidence-first autonomous QA agent for AI output review, browser-game playtesting, and Android flow smoke tests.

For this bounty, the agent runs a scheduled bounty-scout workflow:
1. It discovers SAP-compatible tools from a local registry.
2. It selects three Ace Data Cloud style services for search, summarization, and risk classification.
3. It invokes one Synapse Sentinel style review to flag artificial-loop and wash-volume risk.
4. It creates an x402-compatible payment ledger for each tool call, including payer, settlement wallet, amount, route, and memo.
5. It writes an end-to-end JSON evidence report for auditability.

Current local evidence: output/oobe-agent-run.json
Virtuals live agent: https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61
Settlement wallet: 2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD

Category target: Ace Data Cloud Usage first, General Payment Volume second.
```

## Missing Before Final Submission

- Live SAP mainnet registration evidence
- Live Ace Data Cloud account/API key
- Live x402 facilitator or escrow transaction hashes
- Public GitHub repository URL
- Demo video or public walkthrough URL
- X post tagging `@OOBEonSol` and `@AceDataCloud`

## Live Readiness Notes

SDK install status on 2026-06-02:

- `@oobe-protocol-labs/synapse-client-sdk@2.0.6` imports successfully.
- `@virtuals-protocol/acp-node-v2@0.1.2` imports successfully.
- `@oobe-protocol-labs/synapse-sap-sdk@0.19.8` failed to import because an internal extensionless `constants/programs` import was unresolved under this Node environment.
- It was downgraded to `@oobe-protocol-labs/synapse-sap-sdk@0.13.0`, which reduced audit findings. Its top-level ESM import still fails, but direct CJS fallback via `dist/cjs/index.js` imports successfully and is now detected by `npm run bounty:oobe:ready`.
- `npm audit` now reports 27 vulnerabilities from the SDK dependency tree: 12 low, 10 moderate, 5 high. Do not run `npm audit fix --force` without checking SDK compatibility.

Required live environment variables are listed in `.env.example`. Do not paste private keys in chat.

## Latest Verification Snapshot

Checked on 2026-06-02:

- `npm run build`: passed.
- `npm run bounty:oobe:demo`: passed and wrote `output/oobe-agent-run.json`.
- `npm run bounty:oobe:report`: passed and wrote `output/oobe-submission-report.md`.
- `npm run bounty:oobe:ready`: dependency checks passed, but final status is `not_ready` until live SAP/Ace/x402 credentials, public repo URL, public demo URL, and transaction evidence are present.
- `npm run android:probe`: Android QA probe exists, but `adb` is not currently available on PATH.

## X Post Draft

```text
Built ProofDeskQA for the @OOBEonSol x @AceDataCloud autonomous agent bounty.

It discovers SAP-compatible tools, runs 3 Ace-style services plus a Sentinel review, and records x402-compatible payment traces from trigger -> execution -> payment.

Category: Ace Data Cloud Usage + General Payment Volume
Repo: <github-url>
Demo: <video-url>
```
