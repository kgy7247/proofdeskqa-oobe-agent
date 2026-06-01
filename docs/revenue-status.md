# Revenue Status

Status checked: 2026-06-02

## Goal

- Target: `5 SOL`
- User settlement wallet: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`
- Base USDC payout wallet: `0x66890857dc33d5066c28aadbeb7cd078f50799a3`
- Payout address ledger: `docs/payout-addresses.md`
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
- Chrome-authenticated page check on 2026-06-02 KST still showed agent wallet balance `$0.00`, wallet activity revenue `$0.00`, console `Not enabled`, and no visible incoming job/order queue on the checked Overview surface.

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
- Bento SDK/API evidence package prepared on 2026-06-02 KST:
  - Report: `docs/bento-beta-submission-report.md`
  - Reproduction command: `npm run bento:evidence`
  - Latest evidence output: `output/bento-sdk-evidence.json`
  - Current finding: `@bentoguard/sdk@1.2.4` docs/types/runtime disagree around `protect()` second argument, and default runtime creates a synthetic SOL transfer instead of using caller raw transaction bytes.
  - Superteam submission ID: `d5129d0b-95b2-44d8-8579-a1f748ddcd46`
  - Superteam submission status: `Pending` / `Unreviewed`
  - Status: submitted; not counted as earned revenue until accepted or claimable.

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
- Bento beta submission report prepared: `docs/bento-beta-submission-report.md`.
- These are not counted as earned revenue until posted/submitted and accepted.
- Manual GitHub check: the apparent `600 USD` differential reward issue already has multiple open/closed competing PRs, so it is not the next best use of time unless a maintainer requests a fresh approach.
- Manual GitHub check after Bento submission:
  - `ubiquity-os-marketplace/text-conversation-rewards#330` (`225 USD`) is not actionable by a normal external contributor; recent bot logs say the task requires core team or administrator access.
  - `ubiquity/ubiquibot#912` (`200 USD`) has no issue comments, but the repository is archived, so a normal PR route is not viable.

### Agent Marketplace Route Checks

- Route notes: `docs/agent-marketplace-routes.md`.
- TaskBounty public API checked on 2026-06-02 KST:
  - API: `https://www.task-bounty.com/api/v1/tasks`
  - Result: 5 tasks returned; all were `AWARDED` or `CLOSED`, so no immediate PR bounty is open.
  - Scanner status: TaskBounty is now included in `npm run earnings:scan`.
  - Blocker for future submissions: `TASKBOUNTY_API_KEY` is required for task access and submission.
- AgentJob checked on 2026-06-02 KST:
  - Route: `https://agent-job.ai/skill.md`
  - Potential earning mode: paid USDC chat replies.
  - Current blocker: dashboard/API key setup is required; no `AGENTJOB_API_KEY` is present in this repo.
- ClawFreelance checked on 2026-06-02 KST:
  - Discovery endpoint works, but `GET /api/v1/tasks` returned HTTP 500 and the public bounties page showed zero open bounties.
  - Scanner status: ClawFreelance API health is now included in `npm run earnings:scan`.
- ClawdMarket checked on 2026-06-02 KST:
  - Agent registered as `ProofDeskQA`.
  - Profile URL: `https://clawdmkt.com/registry/agent_1780335334461_lhjfm1`.
  - Local API key file: `.secrets/clawdmarket-agent.json` (ignored by git).
  - Self-test result: `warn` because two non-canonical capabilities were supplied, but auth, inbox, payment descriptor, and MCP discovery checks passed.
  - Claim status remains `pending_claim`.
  - Bids placed:
    - `bid_1780335363515_rnk90s` for `Benchmark x402 payment latency across 5 platforms`.
    - `bid_1780335363372_1s2vav` for `Verify registered-agent service and task creation flow`.
    - `bid_1780335363371_pxzf56` for `Research emerging A2A protocol standards and summarize`.
  - Current status: all bids are pending; no revenue until accepted and paid.
  - Active service listings created on 2026-06-02 KST:
    - Browser game playtest evidence report, `0.10 BANKR`, listing `b6bf2556-604a-47c1-9a24-c8772ffcd982`.
    - Android flow smoke test report, `0.15 BANKR`, listing `f63624d6-b7ff-4c6f-afb1-d559b7098dc8`.
    - AI output QA hallucination check, `0.05 BANKR`, listing `dd3d4270-46c9-4c45-9803-6d934ebd6fbd`.
    - TypeScript API smoke test notes, `0.10 BANKR`, listing `fb9f476d-165c-425b-9d17-50f7872de406`.
  - Status: listings are active sales surfaces; not counted as revenue until a trade is created/completed and payout is claimable or received.
  - Latest public profile status check: `output/approval-status-check-20260602.json`.
  - Public profile still reports `completed_trades=0`, `total_trades=0`, `total_volume=0`, and profile status `inactive`.
- MonetizeYourAgent checked on 2026-06-02 KST:
  - Jobs API returned 11 active jobs, including Pyrimid USDC bounties from 10-100 USDC.
  - Latest approval/status check: `output/approval-status-check-20260602.json`.
  - Public application-status endpoint probes returned `404`; the available public Jobs API still shows the submitted Pyrimid jobs as active, not accepted/paid.
  - Scanner status: MonetizeYourAgent jobs are now included in `npm run earnings:scan`.
  - Current blocker: strongest jobs require Base USDC wallet/on-chain proof, accepted PR/patch, or have crowded responses.
  - Pyrimid paid MCP tool guide bounty work prepared:
    - Bounty: `Pyrimid bounty: write a useful paid MCP tool guide` for `10 USDC`.
    - Deliverable: `docs/pyrimid-paid-mcp-tool-guide.md`.
    - Verification: public Pyrimid seed endpoint returned HTTP `402 Payment Required` with `X-Payment-Required`, catalog URL, and MCP discovery metadata.
    - Submission URL: `https://github.com/kgy7247/proofdeskqa-oobe-agent/blob/main/docs/pyrimid-paid-mcp-tool-guide.md`.
    - Submission response: `output/mya-pyrimid-guide-submission.json`.
    - API status: `success=true`, `message="Application submitted"`.
    - Current status: submitted; not counted as revenue until accepted and paid.
  - Pyrimid MCP server audit output patch submitted:
    - Bounty: `Pyrimid bounty: improve mcp-server-audit output` for `20 USDC`.
    - Deliverable: `docs/pyrimid-mcp-server-audit-output-patch.md`.
    - Patch file: `output/pyrimid-mcp-server-audit-output.patch`.
    - Validation in fresh Pyrimid clone: `git diff --check`, `npm install`, and `npm run build` passed.
    - Submission response: `output/mya-pyrimid-mcp-audit-submission.json`.
    - API status: `success=true`, `message="Application submitted"`.
    - Current status: submitted; not counted as revenue until accepted and paid.
  - Pyrimid vendor lead discovery output patch submitted:
    - Bounty: `Pyrimid bounty: improve vendor-lead-discovery output` for `20 USDC`.
    - Deliverable: `docs/pyrimid-vendor-lead-discovery-output-patch.md`.
    - Patch file: `output/pyrimid-vendor-lead-discovery-output.patch`.
    - Validation in fresh Pyrimid clone: `git diff --check`, `npm install`, and `npm run build` passed.
    - Submission response: `output/mya-pyrimid-vendor-lead-submission.json`.
    - API status: `success=true`, `message="Application submitted"`.
    - Current status: submitted; not counted as revenue until accepted and paid.
  - Pyrimid SDK integration bounty waitlist entry submitted:
    - Bounty: `Pyrimid Integration Bounty: First 5 agents get $100 USDC`.
    - Deliverable: `docs/pyrimid-integration-bounty-submission.md`.
    - Reproduction command: `npm run pyrimid:integration`.
    - Evidence output: `output/pyrimid-integration-demo.json`.
    - Integration: `@pyrimid/sdk@0.2.6` with `PyrimidResolver`, `calculateSplit`, and `PYRIMID_ADDRESSES.base`.
    - Submission response: `output/mya-pyrimid-integration-submission.json`.
    - API status: `success=true`, `message="Added to waitlist"`.
    - Current status: waitlisted; not counted as revenue until accepted and paid.
  - Base USDC payout update attempt after user supplied the Base wallet:
    - Base wallet: `0x66890857dc33d5066c28aadbeb7cd078f50799a3`.
    - Update response file: `output/mya-base-usdc-wallet-update-submissions.json`.
    - Jobs retried: 20, 24, 25, and 26.
    - API status: all update attempts returned `409 Conflict`, so the original submissions remain pending/waitlisted and were not replaced.
    - Rule for future Base-only MYA jobs: use the Base wallet above in the first submission.
  - Pyrimid registry listing route checked for Job 23:
    - Target bounty: `Pyrimid bounty: registry listing accepted` for `10 USDC`.
    - MCP.Directory public search for `pyrimid` did not show an existing live result.
    - MCP.Directory submit endpoint response: `409`, `This repository has already been submitted. We'll review it soon!`.
    - Evidence file: `output/mcp-directory-pyrimid-submission.json`.
    - Current status: directory review appears pending; do not submit Job 23 as completed until there is an accepted PR, merged listing, or live directory page.
  - Pyrimid signal distribution route submitted:
    - Target: Job 19, `Signal Distribution: 50% commission on pragma.trading signals`.
    - Deliverable: `docs/pyrimid-signal-distribution.md`.
    - Reproduction command: `npm run pyrimid:signals`.
    - Evidence output: `output/pyrimid-signal-distribution.json`.
    - Best current catalog product: `onchain_0x03151e_2`, price `$0.50`, affiliate `5000 bps`, estimated `$0.25 USDC` commission per routed call.
    - Submission response: `output/mya-pyrimid-signal-distribution-submission.json`.
    - API status: `201`, `success=true`, `message="Added to waitlist"`.
    - Current status: waitlisted/distribution-ready; not counted as revenue until a non-self routed payment creates claimable or received commission.
- GH Bounty and Collaborators checked on 2026-06-02 KST:
  - Both have plausible crypto/USDC payout surfaces, but require account/API-key or wallet/GitHub login before work can be listed/submitted by this agent.
- x402 Hub checked on 2026-06-02 KST:
  - Route: `https://docs.x402hub.ai/docs/getting-started/for-agents`
  - Current blocker: docs describe Base Sepolia/testnet status and a 20 USDC stake requirement before claiming runs, so it is not a no-capital route right now.
- Base USDC payout note:
  - User supplied verified Base-format payout address: `0x66890857dc33d5066c28aadbeb7cd078f50799a3`.
  - Virtuals UI still only exposed an abbreviated EVM agent wallet during the checked clipboard flow; do not infer that it equals the user supplied Base address.

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
