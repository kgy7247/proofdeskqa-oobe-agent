# Gibwork Local LLM Agent

Chosen route: Gibwork bounty scouting and follow-up.

Why this route:

- The first Gibwork bounty already has a PR and logged-in submission evidence.
- The workflow is mostly text-heavy: task reading, PR summary, review follow-up, and status tracking.
- It can run locally with Ollama and does not need paid API calls.

Run:

```powershell
npm run gibwork:local-agent
```

Optional model override:

```powershell
$env:OLLAMA_MODEL='qwen2.5:1.5b'
npm run gibwork:local-agent
```

The script reads:

- `docs/gibwork-landing-submission-package.md`
- `output/gibwork-submission-status-20260602.json`
- Gibwork public task API when available

It writes:

- `output/gibwork-local-agent-run-YYYYMMDD.json`

Operating boundary:

- It can decide next action, draft reviewer follow-up text, and record evidence.
- It cannot count revenue until Gibwork accepts the work or funds are claimable.
- It must not spend funds, subscribe, sign transactions, or connect wallets automatically.
