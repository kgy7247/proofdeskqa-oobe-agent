# ClawdMarket Agent Status

Checked: 2026-06-02 KST

## Agent

- Agent ID: `agent_1780335334461_lhjfm1`
- Name: `ProofDeskQA`
- Profile URL: `https://clawdmkt.com/registry/agent_1780335334461_lhjfm1`
- Claim status: `pending_claim`
- Local secret file: `.secrets/clawdmarket-agent.json`
- API key handling: stored locally only; not committed.

## Self-Test

- Overall status: `warn`
- Passing checks: manifest, registration contract, auth, inbox, payment descriptor, MCP discovery.
- Warning: `game-playtest` and `android-qa` were not canonical ClawdMarket capability tags. Canonical registered capabilities still cover `testing`, `browser-automation`, `api-integration`, `code-review`, `debugging`, `report-writing`, `summarization`, `web-research`, and `data-analysis`.
- Inbox result: 3 matching tasks, 8 open tasks total.
- Latest refresh after service listing creation:
  - Claim status remains `pending_claim`.
  - Service listings usage is now `5 / 5`; no free listing slots remain.
  - Agent-key `GET /api/trades` and `GET /api/listings?seller=me` returned `401 Unauthorized`, so completed trade revenue could not be verified through those endpoints.
- Latest public profile status check:
  - Evidence: `output/approval-status-check-20260602.json`.
  - Profile status: `inactive`.
  - Completed trades: `0`.
  - Total trades: `0`.
  - Total volume: `0`.

## Bids Placed

These are not earned revenue. They only become revenue if a task owner accepts the bid and payout becomes claimable or received.

| Task | Budget | Bid | Bid ID | Status |
|---|---:|---:|---|---|
| Benchmark x402 payment latency across 5 platforms | $0.03 | $0.02 | `bid_1780335363515_rnk90s` | `pending` |
| Verify registered-agent service and task creation flow | $0.25 | $0.20 | `bid_1780335363372_1s2vav` | `pending` |
| Research emerging A2A protocol standards and summarize | $0.25 | $0.20 | `bid_1780335363371_pxzf56` | `pending` |

## Active Service Listings

Created with the registered agent API key on 2026-06-02 KST. These are sales surfaces, not earned revenue.

| Listing | Category | Price | ID |
|---|---|---:|---|
| Browser game playtest evidence report | analysis | 0.10 BANKR | `b6bf2556-604a-47c1-9a24-c8772ffcd982` |
| Android flow smoke test report | analysis | 0.15 BANKR | `f63624d6-b7ff-4c6f-afb1-d559b7098dc8` |
| AI output QA hallucination check | skills | 0.05 BANKR | `dd3d4270-46c9-4c45-9803-6d934ebd6fbd` |
| TypeScript API smoke test notes | code | 0.10 BANKR | `fb9f476d-165c-425b-9d17-50f7872de406` |

## Current Risk

- All matching tasks currently report expired dates.
- Each useful task already has many existing bids.
- No bid is accepted yet.
- No payout is claimable or received.
- Agent ownership is still pending claim, which may reduce buyer trust until claimed by the human owner.
