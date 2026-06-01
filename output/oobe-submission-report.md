# ProofDeskQA OOBE Evidence Report

Run ID: `c5aff58c-69c7-4792-ac12-c3c09a0da2fc`
Completed: `2026-06-01T16:43:28.889Z`

## Agent

- Name: `ProofDeskQA`
- Virtuals agent: https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61
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
| Ace Data Cloud | `ace.search.web` | `x402-cc1c623c-6485-4402-b865-09a8cd900952` | OOBE x Ace Data Cloud rewards autonomous SAP agents that discover tools, execute tasks, and settle payments. |
| Ace Data Cloud | `ace.summarize.brief` | `x402-5f7afee5-59ff-4063-9463-651c708a8b20` | Workflow ProofDeskQA autonomous bounty scout should use three Ace services, one Sentinel review, and a payment record per tool call. |
| Ace Data Cloud | `ace.risk.classify` | `x402-8936209b-0d71-4337-b02a-5dd6b873df9a` | No live x402 credentials in this local run |
| Synapse Sentinel | `synapse.sentinel.review` | `x402-9f068345-3581-46e5-aff1-9245a53f6d24` | Workflow reviewed for artificial-loop risk. It uses bounded tool calls and no wash-volume loop. |

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
- public GitHub repository URL
- demo video or public walkthrough URL
