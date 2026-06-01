# Revenue Status

Status checked: 2026-06-02

## Goal

- Target: `5 SOL`
- User settlement wallet: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`
- USDC is acceptable as an intermediate earning route, but goal completion still requires verified received value toward 5 SOL.
- Latest wallet check:
  - User settlement wallet: `0.647780141 SOL`
  - Virtuals agent SOL wallet: `0 SOL`
  - Gap to 5 SOL on the user settlement wallet: `4.352219859 SOL`

## Verified External Work Surfaces

### Virtuals ACP

- `ProofDeskQA` agent registered.
- Agent page: `https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61`
- Jobs published:
  - `aiOutputQaReport` at 0.05 USD
  - `browserGamePlaytest` at 0.10 USD
  - `androidFlowSmokeTest` at 0.15 USD
- Last observed revenue: `$0.00`

### Superteam Earn Agent

- Agent registered.
- Username: `proofdeskqa-deafening-5`
- Claim URL: `https://superteam.fun/earn/claim/E669DD2F6361136FB38B9CF2`
- API key is stored locally in `.secrets/superteam-agent.json`.
- `npm run superteam:check` currently returns agent-eligible listings, but all returned listings were stale on 2026-06-02: expired or winners announced.
- Public search still shows a current OOBE x Ace Data Cloud listing worth targeting: `https://superteam.fun/earn/listing/autonomous-agent-bounty-oobe-ace-data-cloud/`.

### OOBE x Ace Data Cloud Bounty

- Submission package created in `docs/oobe-submission-package.md`.
- Local demo script: `npm run bounty:oobe:demo`.
- Latest local demo output: `output/oobe-agent-run.json`.
- Latest submission report: `output/oobe-submission-report.md`.
- Readiness script: `npm run bounty:oobe:ready`.
- Latest readiness output: `output/oobe-live-readiness.json`.
- Current readiness: not ready for final bounty submission because live SAP/Ace/x402 credentials, public repo/demo URL, and live transaction evidence are missing.
- SDK status: Synapse client SDK and Virtuals ACP SDK import successfully. Synapse SAP package ESM entry fails under this Node environment, but direct CJS fallback import succeeds and is detected by the readiness script.

## Latest Local Verification

Checked on 2026-06-02:

- `npm run build`: passed.
- `npm run wallets:check`: user wallet `0.647780141 SOL`, Virtuals SOL wallet `0 SOL`.
- `npm run bounty:oobe:demo`: passed; latest run ID is recorded in `output/oobe-agent-run.json`.
- `npm run bounty:oobe:report`: passed.
- `npm run bounty:oobe:ready`: `not_ready`; missing live SAP/Ace/x402 environment variables plus public repo/demo URLs.
- `npm run superteam:check`: passed API call, but returned stale agent-eligible listings.
- `npm run android:probe`: adb is not installed or not on PATH, so emulator QA is prepared but not runnable on this machine yet.

## Verification Commands

```powershell
npm run build
npm run superteam:check
powershell -ExecutionPolicy Bypass -File scripts/check-solana-wallets.ps1
npm run bounty:oobe:demo
npm run bounty:oobe:report
npm run bounty:oobe:ready
```

## Completion Rule

Do not mark the goal complete until wallet/revenue evidence proves at least 5 SOL, or accepted USDC/SOL payout equivalent, has been earned and is claimable or received.
