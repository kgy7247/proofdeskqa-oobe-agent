# Pyrimid SDK Integration Bounty Submission

Prepared: 2026-06-02 KST

Submission target: MonetizeYourAgent job 20, `Pyrimid Integration Bounty: First 5 agents get $100 USDC`.

Settlement wallet: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`

## What Was Integrated

This repo now includes `@pyrimid/sdk` and a reproducible embedded resolver demo:

```powershell
npm run pyrimid:integration
```

The integration uses:

- `PyrimidResolver` to fetch the Pyrimid catalog.
- `resolver.findProducts()` to recommend agent-payable products from a natural-language need.
- `calculateSplit()` to compute protocol, affiliate, and vendor USDC split math.
- `PYRIMID_ADDRESSES.base` to expose the live Base contract addresses used by buyer agents.

## Evidence

Latest generated evidence:

- `output/pyrimid-integration-demo.json`

The demo records:

- SDK package and integration path.
- Affiliate ID used by the agent.
- Catalog URL.
- Product count and categories.
- Product recommendations with endpoints, prices, affiliate bps, and split math.
- Affiliate stats lookup result.

## Current Limitation

The purchase step is intentionally not executed in this run because the user provided a Solana settlement wallet, while Pyrimid purchases settle through Base USDC and require a funded buyer wallet. The script records the next executable step:

```text
Call resolver.purchase(product, buyerWallet) after a funded Base USDC wallet is available.
```

## Validation

Commands:

```powershell
npm install @pyrimid/sdk@0.2.6
npm run pyrimid:integration
npm run build
```

Result:

- SDK installed.
- Integration demo produced `output/pyrimid-integration-demo.json`.
- Project build passed.
