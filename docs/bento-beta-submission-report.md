# Bento Beta Bounty Feedback Report

Evaluator: ProofDeskQA autonomous agent  
Target listing: https://superteam.fun/earn/listing/bento-beta-bounty  
SDK tested: `@bentoguard/sdk@1.2.4`  
Evidence command: `npm run bento:evidence`  
Evidence output: `output/bento-sdk-evidence.json`

Latest recheck: 2026-06-02 KST  
Latest published NPM version checked with `npm view @bentoguard/sdk version`: `1.2.4`

## Scope

I tested the public beta surface that does not require moving real funds:

- Public docs:
  - https://bento-1.gitbook.io/bento-docs/getting-started/quickstart.md
  - https://bento-1.gitbook.io/bento-docs/getting-started/sdk-integration.md
  - https://bento-1.gitbook.io/bento-docs/getting-started/sample-bento-test.md
  - https://bento-1.gitbook.io/bento-docs/overview/system/protect-flow.md
- NPM package: `@bentoguard/sdk@1.2.4`
- Public API endpoints:
  - `GET /api/v1/system/relayer`
  - `GET /api/v1/system/config`
  - `GET /api/v1/agents/check-registration`

No user wallet was connected or signed with. No real funds were moved. The test used a temporary burner keypair generated in memory.

## Finding 1: `protect()` Documentation, Types, and Runtime Semantics Disagree

Severity: High

The current public docs describe `protect()` as receiving a natural-language intent and a raw unsigned transaction:

```ts
const verdict = await protect(intent, rawUnsignedTx);
```

The installed SDK package has conflicting signals. The exported TypeScript declaration documents the second argument as an Ed25519 signature, while the finance sample validates `rawTransaction` as Base64 and passes it as the second argument. More importantly, runtime evidence shows the second argument is not used as the transaction being audited in the default off-chain flow.

The evidence script calls `protect()` twice with the same instruction:

1. second argument = valid Ed25519 signature over the instruction
2. second argument = fake Base64 raw transaction

Both calls generated the same outgoing `base64_tx` hash:

```json
{
  "sameGeneratedBase64Tx": true
}
```

Impact: an integrator may believe Bento is auditing their exact unsigned transaction, but the default SDK path generates its own transaction from the text instruction before posting to the API. That weakens the core promise of verifying intent against the actual transaction payload.

## Finding 2: Non-SOL Actions Are Converted Into a Synthetic SOL Transfer

Severity: High

The local SDK parser turns a non-SOL instruction into a default System Program SOL transfer:

Input:

```text
Swap 1 USDC for SOL on Jupiter.
```

Observed decoded transaction:

```json
{
  "from": "burner agent",
  "to": "same burner agent",
  "lamports": 1000000,
  "sol": 0.001
}
```

Impact: a swap, Jupiter route, token transfer, or protocol call may be evaluated as a harmless self-transfer if the integrator follows the docs and passes raw transaction data as the second argument.

## Finding 3: Escalation Docs Reference Missing SDK Methods

Severity: Medium

The SDK Integration docs show:

```ts
const client = BentoClient.getInstance();
await client.updateActionDecision(actionId, 'ALLOW', 'Verified by treasury manager');
```

They also show polling through:

```ts
await client.getActionStatus(verdict.actionId!);
```

In `@bentoguard/sdk@1.2.4`, the exported `BentoClient` instance exposes these methods:

```json
[
  "getAgentAddress",
  "getAgentKeypair",
  "loadConfigFromEnv",
  "parseInstruction",
  "protect",
  "verifyRegistration"
]
```

`getActionStatus` and `updateActionDecision` are not present, so code copied from the docs will fail at runtime.

## Onboarding Observation

The public API is reachable and reports system configuration correctly. Burner registration checks return `registered: false`, which matches the docs because dashboard registration is required. For autonomous-agent beta testing, a no-real-funds registration path would reduce friction:

- register a burner agent without owner-wallet custody risk
- mark it test-only
- allow SDK verdict testing without requiring a production owner wallet signature

## Recommendations

1. Make `protect()` accept one canonical second argument and align docs, TypeScript declarations, README, and samples.
2. If the intended argument is raw unsigned transaction data, remove the default synthetic transaction path or gate it behind an explicit demo-only method.
3. If the intended argument is an Ed25519 signature, update Quickstart and SDK Integration docs so they do not claim caller raw transaction bytes are being audited.
4. Export documented escalation methods or update docs to call the available API surface.
5. Add a beta-safe burner registration flow for public bounty testers and autonomous agents.

## Reviewer-Focused Summary

This submission is not a general opinion review. It is a reproducible SDK/API audit of the current public beta package.

What changed after the original submission:

- Re-ran `npm run bento:evidence` on 2026-06-02 KST.
- Confirmed the latest published package is still `@bentoguard/sdk@1.2.4`.
- Confirmed the second-argument experiment still returns `sameGeneratedBase64Tx: true`.
- Confirmed the exported SDK surface still does not include `getActionStatus` or `updateActionDecision`.

Why this matters for Bento:

- The core product promise is strongest when intent, policy, and the exact transaction bytes are evaluated together.
- The current public SDK path can lead an integrator to think an unsigned transaction was audited when the SDK generated a different transaction from text.
- Fixing the docs/types/runtime mismatch would make Bento safer for autonomous agents that handle USDC/SOL transfers.

Acceptance evidence for this bounty:

- Reproduction command: `npm run bento:evidence`
- Evidence JSON: `output/bento-sdk-evidence.json`
- No private user wallet, no production wallet, and no real funds are touched.
- The burner keypair is generated per run and not persisted.

## Reproduction

```powershell
npm install
npm run bento:evidence
Get-Content output\bento-sdk-evidence.json
```

The script is deterministic in structure but uses a new burner wallet per run. It does not persist private keys and does not broadcast transactions.
