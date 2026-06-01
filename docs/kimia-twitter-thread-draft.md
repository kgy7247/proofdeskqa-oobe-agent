# Kimia Protocol Twitter Thread Draft

Prepared for the Superteam listing:

- Listing: `https://superteam.fun/earn/listing/write-a-twitter-thread-on-kimia-protocol`
- Reward pool: `110 USDC`
- Deadline: `2026-06-03 03:29:59 KST`
- Settlement wallet for payout tracking: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`

## Submission Status

Not posted and not submitted yet.

External steps required before a compliant submission:

- Post this as a real X/Twitter thread from an account the operator controls.
- Tag `@KimiaProtocol`.
- Join the Kimia Telegram community if the operator can truthfully answer the required eligibility question.
- Submit the posted thread link through Superteam Earn.

## Thread

1/8

Most DeFi yield products make users guess what they are really earning. @KimiaProtocol is trying to make one specific yield source tradable on Solana: perp funding.

The simple version: longs pay funding, and Kimia turns that future funding stream into fixed-income building blocks.

2/8

The core problem is noble enough: DeFi users want yield, but they also want to know where it comes from.

Kimia's answer is not "trust this black-box vault." It is a stack where the perp market, delta-neutral vault, PT/YT split, yield AMM, and intent router are separate pieces.

3/8

The product loop is interesting:

- trade SOL perps with USDC collateral
- deposit into a delta-neutral vault to capture funding
- split vault positions into PT and YT
- sell or buy those legs through a yield AMM
- use intents to target a minimum APY

That is a fixed-rate market, not just another APY label.

4/8

Why Solana?

Perp funding only becomes a usable yield layer if the system can handle frequent pricing, liquidation, routing, and token transfers without making every action feel expensive.

Solana's speed and USDC liquidity make the design plausible in a way that would be painful on slower, high-fee rails.

5/8

Where Kimia differs from many competitors:

It is not merely wrapping external lending rates. The docs describe an on-chain perp source, a vault that owns the hedge, tokenized PT/YT legs, and an AMM where PT moves toward par as maturity approaches.

That gives users a market price for future yield.

6/8

Potential impact:

If this works, "fixed income on Solana" stops being a marketing phrase and becomes a composable primitive. Traders can speculate on funding. Passive users can lock a rate. Other apps can route into PT/YT markets instead of rebuilding yield logic from scratch.

7/8

The roast:

Kimia still has a communication challenge. PT, YT, funding, delta-neutral hedging, and delayed settlement are a lot for new users.

The app needs brutally clear risk displays: funding can flip, hedges can fail, liquidity can thin, and fixed-rate UX should never hide those realities.

8/8

What I would test as a user:

- compare implied fixed APY vs live funding
- simulate early exit through the yield AMM
- stress-test what happens when funding goes negative
- watch kUSD delayed settlement UX

Follow @KimiaProtocol and read the docs if you want to track Solana-native fixed income.

## Visual Prompt

Use `assets/kimia-yield-layer-card.svg` as a visual attachment or recreate it as an image before posting.
