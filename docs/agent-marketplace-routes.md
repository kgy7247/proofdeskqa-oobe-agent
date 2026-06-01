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

## ClawFreelance

- Route: `https://www.clawfreelance.com/`
- API docs: `https://www.clawfreelance.com/docs/api`
- Public discovery endpoint: `https://clawfreelance.com/api/v1/discover`
- Payout surface: public docs describe USDC/crypto rewards for autonomous agents.
- Current scan result: discovery endpoint works, but `GET /api/v1/tasks` returned server error `500`, and the public bounties page showed `0 Total Open Bounties`.
- Local status: added to `npm run earnings:scan` as an API-health route so it can surface tasks if the endpoint begins returning data.

## ClawdMarket

- Route: `https://clawdmkt.com/`
- Skill file: `https://clawdmkt.com/skill.md`
- Public task API: `https://clawdmkt.com/api/tasks?status=open`
- Local agent status: `docs/clawdmarket-agent-status.md`
- Current result: agent registration, self-test, usage, inbox, and bidding all work.
- Bids placed: 3 pending bids on matching tasks.
- Current blocker: the public tasks are expired and crowded; no bid has been accepted yet.

## MonetizeYourAgent

- Route: `https://monetizeyouragent.fun/`
- Jobs API: `https://monetizeyouragent.fun/api/v1/jobs`
- Current result: API returned 11 active jobs, including Pyrimid USDC bounties.
- Most plausible no-social candidates:
  - `Pyrimid bounty: write a useful paid MCP tool guide` for `10 USDC`.
  - `Pyrimid bounty: registry listing accepted` for `10 USDC`.
  - `Pyrimid bounty: improve vendor-lead-discovery output` for `20 USDC`.
  - `Pyrimid bounty: improve mcp-server-audit output` for `20 USDC`.
- Current blockers: most jobs require Base USDC wallet/on-chain proof, merged PR/accepted patch, or have many existing responses.

## GH Bounty

- Route: `https://www.ghbounty.com/`
- Agent docs: `https://www.ghbounty.com/agents`
- MCP health: `https://mcp.ghbounty.com/api/health`
- Payout surface: Solana/SOL bounty escrow according to the public landing page.
- Current requirement: account/API key or OAuth is required before the MCP `bounties.list` tool can be used.
- Local status: health endpoint works, but no authenticated bounty listing is available in this repo.

## Collaborators

- Route: `https://collaborators.build/`
- Payout surface: public page describes USDC rewards paid to a connected Solana wallet after merged PR verification.
- Current requirement: GitHub login and wallet linking.
- Local status: not runnable without explicit account/login authorization.

## ClawTasks

- Route: `https://clawtasks.com/`
- Public status: page says ClawTasks is currently free-task only and paid bounties are winding down.
- Local status: not a current paid route.

## x402 Hub

- Route: `https://docs.x402hub.ai/docs/getting-started/for-agents`
- Payout surface: completed runs on x402 Hub.
- Current requirement: docs say x402 Hub is on Base Sepolia testnet and agents should stake 20 USDC before claiming runs.
- Local status: not a no-capital route; API probes also showed endpoint/TLS friction in this environment.
- Safe next step: skip until there is a funded Base route and a confirmed mainnet-compatible earning path.

## Completion Rule

These routes are discovery and readiness work only. Count revenue only after a sponsor accepts the work, a payout is claimable, or funds land in the settlement wallet.
