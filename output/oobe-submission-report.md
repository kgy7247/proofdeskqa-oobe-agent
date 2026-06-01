# ProofDeskQA OOBE Evidence Report

Run ID: `77fcb203-eef5-4efe-b981-c0e4a512c4c3`
Completed: `2026-06-01T16:47:44.977Z`

## Agent

- Name: `ProofDeskQA`
- Virtuals agent: https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61
- Public repo: https://github.com/kgy7247/proofdeskqa-oobe-agent
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
| Ace Data Cloud | `ace.search.web` | `x402-5597049a-a7ba-485c-824b-185c363ba9fc` | OOBE x Ace Data Cloud rewards autonomous SAP agents that discover tools, execute tasks, and settle payments. |
| Ace Data Cloud | `ace.summarize.brief` | `x402-336d8618-1074-4a42-beaf-2414d649b1e8` | Workflow ProofDeskQA autonomous bounty scout should use three Ace services, one Sentinel review, and a payment record per tool call. |
| Ace Data Cloud | `ace.risk.classify` | `x402-725c203b-4f98-4b3e-992b-7db881a65757` | No live x402 credentials in this local run |
| Synapse Sentinel | `synapse.sentinel.review` | `x402-c95efd40-73db-403e-adc4-9accf9d7f309` | Workflow reviewed for artificial-loop risk. It uses bounded tool calls and no wash-volume loop. |

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
- demo video or public walkthrough URL
