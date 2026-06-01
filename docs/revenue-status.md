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
- USDC/USDG opportunity scanner added: `npm run earnings:scan`.
- Latest scanner output: `output/earning-opportunities.json` and `docs/usdc-earning-opportunities.md`.
- Current best Superteam agent-eligible candidates:
  - Bento beta bounty: `200 USDC` pool, but private beta access / X interaction / safe on-chain test path must be clarified.
  - Kimia thread bounty: `110 USDC`, but a controlled X account and truthful Telegram community step are required.
- Bento clarification comment posted through the Superteam agent on 2026-06-02 KST:
  - Comment ID: `f6ebe6cb-201b-4aba-bd9a-8491a22250ce`
  - Purpose: asked whether private beta access is mandatory and what no-real-funds test path agents should run.

### OOBE x Ace Data Cloud Bounty

- Public repo: `https://github.com/kgy7247/proofdeskqa-oobe-agent`
- Public walkthrough: `https://github.com/kgy7247/proofdeskqa-oobe-agent/blob/main/docs/demo-walkthrough.md`
- Superteam page metadata shows this listing as `HUMAN_ONLY`, so the Superteam agent API cannot submit it.
- Submission package created in `docs/oobe-submission-package.md`.
- Local demo script: `npm run bounty:oobe:demo`.
- Latest local demo output: `output/oobe-agent-run.json`.
- Latest submission report: `output/oobe-submission-report.md`.
- Readiness script: `npm run bounty:oobe:ready`.
- Latest readiness output: `output/oobe-live-readiness.json`.
- Current readiness: not ready for final bounty submission because live SAP/Ace/x402 credentials and live transaction evidence are missing.
- SDK status: Synapse client SDK and Virtuals ACP SDK import successfully. Synapse SAP package ESM entry fails under this Node environment, but direct CJS fallback import succeeds and is detected by the readiness script.

## Latest Local Verification

Checked on 2026-06-02:

- `npm run build`: passed.
- `npm run wallets:check`: user wallet `0.647780141 SOL`, Virtuals SOL wallet `0 SOL`.
- `npm run bounty:oobe:demo`: passed; latest run ID is recorded in `output/oobe-agent-run.json`.
- `npm run bounty:oobe:report`: passed.
- `npm run bounty:oobe:ready`: `not_ready`; public repo and walkthrough URLs are now present, but live SAP/Ace/x402 environment variables are still missing.
- `npm run superteam:check`: passed API call, but returned stale agent-eligible listings.
- `npm run android:probe`: adb is not installed or not on PATH, so emulator QA is prepared but not runnable on this machine yet.

### Agentic Engineering Grant

- Grant page: `https://superteam.fun/earn/grants/agentic-engineering`
- Public page shows open/global with `200 USDG` cheque size.
- Proposal prepared: `docs/agentic-engineering-grant-proposal.md`.
- Superteam login and minimal talent profile creation completed.
- Application modal opened and basic fields were prepared with the settlement wallet.
- Current status: not submitted because a real Telegram username is required.
- Status details: `docs/superteam-grant-application-status.md`.

### USDC/Content Submission Prep

- Kimia thread draft prepared: `docs/kimia-twitter-thread-draft.md`.
- Kimia visual asset prepared: `assets/kimia-yield-layer-card.svg`.
- Bento feedback workplan prepared: `docs/bento-feedback-workplan.md`.
- These are not counted as earned revenue until posted/submitted and accepted.
- Manual GitHub check: the apparent `600 USD` differential reward issue already has multiple open/closed competing PRs, so it is not the next best use of time unless a maintainer requests a fresh approach.

## Verification Commands

```powershell
npm run build
npm run superteam:check
npm run earnings:scan
powershell -ExecutionPolicy Bypass -File scripts/check-solana-wallets.ps1
npm run bounty:oobe:demo
npm run bounty:oobe:report
npm run bounty:oobe:ready
```

## Completion Rule

Do not mark the goal complete until wallet/revenue evidence proves at least 5 SOL, or accepted USDC/SOL payout equivalent, has been earned and is claimable or received.
