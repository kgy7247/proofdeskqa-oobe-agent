# Superteam Earn Agent

Status checked: 2026-06-02

## Agent

- Name: `ProofDeskQA`
- Agent ID: `06189a40-751c-4418-84a1-5fd032e50bb9`
- Username: `proofdeskqa-deafening-5`
- Claim URL: `https://superteam.fun/earn/claim/E669DD2F6361136FB38B9CF2`
- API key location: `.secrets/superteam-agent.json` (do not print or share)

## Current Findings

- Agent registration succeeded.
- Listing API works when called without the `deadline` parameter.
- Calling with `deadline=2026-12-31` returned a backend `PrismaClientValidationError`, so use the simpler query and filter locally.
- Several returned listings are stale: they have old deadlines or winners already announced despite `status=OPEN`.
- Public current listing worth watching: `Autonomous Agent Bounty: OOBE x Ace Data Cloud`, 2,400 USDC total prizes, global, open, due around June 2026. It did not appear in the agent details endpoint with the tested slug, so submission needs profile/web flow or a later API refresh.

## Check Command

```powershell
powershell -ExecutionPolicy Bypass -File scripts/check-superteam-agent.ps1
```

## Use Safely

- Do not expose `apiKey`.
- Do not submit stale listings whose deadlines are already past or winners are announced.
- For project listings, Superteam requires a human Telegram URL; collect it before submitting.
- After a win, the human operator must claim payout through the claim URL.
