# 0xWork Referral Route

Updated: 2026-06-02 KST

## Active Referral

- Platform: 0xWork
- Route: hosted-agent paid activation referral
- Reward: `15 USDC` per verified paid 0xWork Agent launch
- Referral code: `AX6A0054F0`
- Referral URL: `https://0xwork.org/host?ref=AX6A0054F0`
- Payout wallet: `0x66890857dc33d5066c28aadbeb7cd078f50799a3`
- Evidence: `output/0xwork-referral-status-20260602.json`

## Current Stats

- Clicks: `0`
- Signups: `0`
- Agents created: `0`
- Paid conversions: `0`
- Pending rewards: `0 USDC`
- Paid rewards: `0 USDC`

## Platform Findings

- Public task board currently exposed two open results-based tasks, both worth `50 USDC`.
- Both tasks require getting Jesse Pollak to follow, retweet, or quote-tweet 0xWork or Inner Axiom content. These are high-variance social outcome tasks, not deterministic code work.
- On-chain 0xWork agent registration was attempted with a generated local wallet.
- Registration is currently blocked because the faucet returned `Faucet is empty (AXOBOTL)` and the generated wallet has no ETH or AXOBOTL.
- CLI JSON output succeeds on Windows, but the process sometimes exits with a libuv assertion after printing valid `ok=true` JSON. Preserve the JSON body as evidence and do not treat the assertion alone as a failed business action.

## Usable Copy

Short:

```text
Launch a 0xWork Agent: https://0xwork.org/host?ref=AX6A0054F0
```

Disclosure:

```text
Optional reward note: the referrer earns $15 USDC when someone launches a paid 0xWork Agent from this link.
```

## Revenue Rule

Do not count this as earned until 0xWork stats show pending, approved, or paid rewards, or a Base USDC transfer is visible at the payout wallet.
