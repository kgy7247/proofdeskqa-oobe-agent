# ProofDeskQA OOBE Evidence Report

Run ID: `22455d24-b9d9-4fa7-b379-43b217c160e2`
Completed: `2026-06-01T16:48:55.696Z`

## Agent

- Name: `ProofDeskQA`
- Virtuals agent: https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61
- Public repo: https://github.com/kgy7247/proofdeskqa-oobe-agent
- Public demo: https://github.com/kgy7247/proofdeskqa-oobe-agent/blob/main/docs/demo-walkthrough.md
- Settlement wallet: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`

## Requirement Coverage

- tool discovery
- 3 distinct Ace service calls
- Synapse Sentinel call
- x402-compatible payment ledger
- trigger to execution to payment trace

## Tool Calls

| Provider | Service | Payment ID | Result Summary |
| --- | --- | --- | --- |
| Ace Data Cloud | `ace.search.web` | `x402-92ed0102-9ef9-4ad2-98d5-f88ccf03c2c5` | OOBE x Ace Data Cloud rewards autonomous SAP agents that discover tools, execute tasks, and settle payments. |
| Ace Data Cloud | `ace.summarize.brief` | `x402-ee968eaa-413f-4615-b361-17038aef9a0c` | Workflow ProofDeskQA autonomous bounty scout should use three Ace services, one Sentinel review, and a payment record per tool call. |
| Ace Data Cloud | `ace.risk.classify` | `x402-0586604f-a352-462c-80d0-e069af77be42` | No live x402 credentials in this local run |
| Synapse Sentinel | `synapse.sentinel.review` | `x402-0fc4d3a5-483a-4da1-b5a0-8c5a803c9689` | Workflow reviewed for artificial-loop risk. It uses bounded tool calls and no wash-volume loop. |

## Payment Ledger

| Status | Route | Amount USDC | Payer | Settlement Wallet |
| --- | --- | ---: | --- | --- |
| simulated | local-x402-ledger | 0.006 | `8MNSiALJ5FmB7huPeUL67MGZTZPxjvR7oDoXLNR9FweU` | `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD` |
| simulated | local-x402-ledger | 0.012 | `8MNSiALJ5FmB7huPeUL67MGZTZPxjvR7oDoXLNR9FweU` | `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD` |
| simulated | local-x402-ledger | 0.014 | `8MNSiALJ5FmB7huPeUL67MGZTZPxjvR7oDoXLNR9FweU` | `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD` |
| simulated | local-x402-ledger | 0.010 | `8MNSiALJ5FmB7huPeUL67MGZTZPxjvR7oDoXLNR9FweU` | `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD` |

## Totals

- Calls: 4
- Ace calls: 3
- Sentinel calls: 1
- Simulated payment volume: 0.042 USDC

## Missing For Live Submission

- live SAP mainnet registration evidence
- live Ace Data Cloud account/API key
- live x402 facilitator or escrow transaction hashes
