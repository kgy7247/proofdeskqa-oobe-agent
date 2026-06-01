# Agentic Engineering Grant Proposal

## Project

ProofDeskQA: an autonomous proof-of-work agent that finds crypto earning opportunities, builds auditable deliverables, and routes verified payouts to a Solana settlement wallet.

## Requested Grant

`200 USDG`

Settlement wallet:

```text
2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD
```

## Public Links

- Repository: `https://github.com/kgy7247/proofdeskqa-oobe-agent`
- Public walkthrough: `https://github.com/kgy7247/proofdeskqa-oobe-agent/blob/main/docs/demo-walkthrough.md`
- Virtuals ACP agent: `https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61`

## What Exists Now

ProofDeskQA already has:

- A public GitHub repository with reproducible scripts.
- A browser-game QA surface built with Phaser for Game Studio-style work proof.
- Android QA probe scaffolding for emulator-based smoke testing.
- A Virtuals ACP agent with three paid service listings.
- A Superteam Earn agent identity.
- An OOBE x Ace Data Cloud evidence package that demonstrates:
  - tool discovery,
  - three Ace Data Cloud style service calls,
  - one Synapse Sentinel style review,
  - x402-compatible payment ledger rows,
  - trigger to execution to payment trace.

## Grant Work Plan

The grant funds the next hardening pass:

1. Add live Synapse/Ace/x402 adapters behind safe environment variables.
2. Record a real transaction-evidence path when credentials are present.
3. Add a Superteam opportunity scanner that filters out stale listings and highlights valid agentic-engineering work.
4. Add a payout ledger that tracks SOL, USDC, and USDG progress toward the `5 SOL` target.
5. Publish a short public walkthrough update showing the live credential-free and credential-enabled modes.

## Why This Fits Agentic Engineering

This is not a static demo. It is an operating agent package with external work surfaces, reproducible evidence, public source, and a payout target. The system is designed to let an AI agent do paid QA, bounty preparation, and grant execution while leaving sensitive signing keys under local operator control.

## Milestones

- Day 1: Live adapter interfaces and readiness checks.
- Day 2: Superteam listing scanner and payout ledger.
- Day 3: Credential-enabled runbook plus public walkthrough update.
- Day 4: Optional live run if Synapse/Ace/x402 credentials and funds are available locally.

## Deliverables

- Updated public repository.
- Updated `output/oobe-live-readiness.json`.
- Updated public walkthrough.
- `docs/revenue-status.md` showing verified payout progress.
- No private keys or API tokens committed to the repository.

## Risk Controls

- Private keys are never requested in chat.
- `.secrets/`, `.env`, `node_modules/`, and build output are ignored.
- Local readiness checks distinguish simulated evidence from live paid transaction evidence.
- Human-only bounties are not submitted through the agent API.
