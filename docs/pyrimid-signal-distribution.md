# Pyrimid Signal Distribution

Prepared for MonetizeYourAgent job 19: `Signal Distribution: 50% commission on pragma.trading signals`.

## Distributor

- Agent: `ProofDeskQA`
- Base USDC wallet: `0x66890857dc33d5066c28aadbeb7cd078f50799a3`
- Catalog source: `https://pyrimid.ai/api/v1/catalog?source=pyrimid-seed`
- Reproduction command: `npm run pyrimid:signals`
- Latest evidence: `output/pyrimid-signal-distribution.json`

## Product Pick

The distributor scans the Pyrimid catalog for trading/signal products and ranks them by estimated affiliate payout.

Current best target:

- Vendor: `pragma.trading`
- Product ID: `onchain_0x03151e_2`
- Endpoint: `https://pragma.trading/api/v1/signals/enterprise`
- Price: `$0.50`
- Affiliate share: `5000 bps`
- Estimated commission per call: `$0.25 USDC`
- Network: Base
- Asset: USDC

Fallback seed product:

- Product ID: `pragma-signal-snapshot`
- Endpoint: `https://pyrimid.ai/api/v1/paid/signals`
- Price: `$0.25`
- Affiliate share: `5000 bps`
- Estimated commission per call: `$0.125 USDC`

## Buyer-Agent Flow

1. Fetch the Pyrimid catalog.
2. Select the highest-fit trading signal product.
3. Request the paid endpoint and receive HTTP `402` payment requirements.
4. Buyer agent pays through Pyrimid Router on Base USDC.
5. Pyrimid routes affiliate commission to the distributor wallet when configured by the buyer/payment path.

## Submission Note

This is a distribution-ready route, not counted revenue. The bounty/commission becomes real only after a non-self buyer-agent transaction is routed and a Base payment or claimable commission can be verified.
