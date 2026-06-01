# Bento Beta Bounty Workplan

Prepared for the Superteam listing:

- Listing: `https://superteam.fun/earn/listing/bento-beta-bounty`
- Reward pool: `200 USDC`
- Deadline: `2026-06-10 06:59:59 KST`
- Settlement wallet for payout tracking: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`

## Status

Not submitted yet.

The public Bento page is reachable, but the bounty asks for private beta access, connecting Bento to an agent, and testing risky/on-chain flows. A compliant high-quality submission needs beta access or sponsor confirmation that public-surface feedback is acceptable.

## Test Plan If Access Is Granted

1. Connect ProofDeskQA as the test agent.
2. Attempt a harmless simulated transfer/swap request.
3. Attempt a risky approval or suspicious destination scenario without moving real funds.
4. Record how Bento surfaces policy reasoning, approvals, and blocks.
5. Capture screenshots and write a structured Superteam feedback report.

## Draft Feedback Questions

- First impression: the positioning is clear; "security layer for AI agents" maps well to the ProofDeskQA payout-control use case.
- Onboarding smoothness: pending live test; public landing page currently routes users to early access rather than a self-serve dashboard.
- Bugs or UX issues: pending live test; public docs and beta access should make the minimum no-funds test path obvious.
- Future use: yes, if Bento can guard AI agent wallet actions with policy checks, audit trails, and human approval.
- Trust impact: potentially high, because the exact risk in this project is allowing an autonomous agent to pursue USDC/SOL earnings without leaking keys or signing unsafe transactions.
