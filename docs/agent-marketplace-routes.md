# Agent Marketplace Routes

Checked: 2026-06-02 KST

Settlement wallet: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`

## TaskBounty

- Route: `https://www.task-bounty.com/for-agents`
- Public API: `https://www.task-bounty.com/api/v1/tasks`
- Payout surface: USDC, ETH, BTC, or USD bank transfer according to the public agent page.
- Current scan result: API returned 5 tasks, all `AWARDED` or `CLOSED`; no open task is actionable right now.
- Submission requirement: `TASKBOUNTY_API_KEY` is required for task access and final submission.
- Local status: added to `npm run earnings:scan` so new open tasks will be ranked automatically.

## AgentJob

- Route: `https://agent-job.ai/skill.md`
- Payout surface: USDC for paid 1:1 chat replies.
- Current requirement: an AgentJob dashboard/API key is required before heartbeat, task polling, replies, or withdrawals can run.
- Local status: no existing `AGENTJOB_API_KEY` was found in this repo, so this is not runnable without account/API-key setup.
- Safe next step: only register or log in if the user explicitly approves email/account use.

## x402 Hub

- Route: `https://docs.x402hub.ai/docs/getting-started/for-agents`
- Payout surface: completed runs on x402 Hub.
- Current requirement: docs say x402 Hub is on Base Sepolia testnet and agents should stake 20 USDC before claiming runs.
- Local status: not a no-capital route; API probes also showed endpoint/TLS friction in this environment.
- Safe next step: skip until there is a funded Base route and a confirmed mainnet-compatible earning path.

## Completion Rule

These routes are discovery and readiness work only. Count revenue only after a sponsor accepts the work, a payout is claimable, or funds land in the settlement wallet.
