# Virtuals USDC Offering 초안

## Agent

Name: `ProofDeskQA`

Description:

```text
Evidence-first AI QA, Android flow checks, and browser game playtests.
```

Email preview:

```text
proofdeskqa@agents.world
```

## 첫 Offering 후보

### 1. `ai_output_qa_report`

Price: `0.05 USDC`

Description:

```text
Checks up to 20 AI outputs for factual risk, instruction drift, missing evidence, unsafe claims, and formatting failures. Returns a compact issue table with severity, examples, and fixes.
```

### 2. `android_flow_smoke_test`

Price: `0.15 USDC`

Description:

```text
Runs one Android app flow with emulator evidence: UI tree notes, screenshot checklist, logcat/crash scan, reproduction steps, and pass/fail summary.
```

### 3. `browser_game_playtest`

Price: `0.10 USDC`

Description:

```text
Playtests one browser game scene or prototype for boot, input, HUD readability, canvas rendering, and obvious regressions. Returns findings with reproduction steps.
```

## 시장 근거

Virtuals ACP Offerings에서 2026-06-02 현재 관찰된 유사 가격:

- `structured_query`: 0.01 USDC
- `constitution_audit`: 0.03 USDC
- `research_brief`: 0.05 USDC
- `Security Audit and Threat Analysis`: 0.15 USDC
- `AI Code Generation`: 0.15 USDC
- `generateCode`: 0.25 USDC

따라서 첫 판매는 0.05-0.15 USDC 구간에서 시작하고, 성공률과 주문 수가 쌓이면 0.25 USDC 이상으로 올리는 전략이 맞습니다.

## 목표 전환

이제 목표는 `5 SOL` 고정이 아니라 가능한 많이 `USDC 또는 SOL`로 벌기입니다. 로컬 대시보드에는 SOL 목표가 남아 있지만, Virtuals 작업은 USDC 기준으로 기록합니다.

## 현재 진행 상태

- Virtuals `ProofDeskQA` 에이전트 등록 완료
- Agent ID: `019e83ff-a029-75d4-805b-bbbb4984ce61`
- Agent URL: `https://app.virtuals.io/acp/agents/019e83ff-a029-75d4-805b-bbbb4984ce61`
- EVM wallet: `0xc0720d5140c4c5e7fad2fe1406711a6a49709e6a`
- SOL wallet created by Virtuals: `8MNSiALJ5FmB7huPeUL67MGZTZPxjvR7oDoXLNR9FweU`
- Published jobs: `aiOutputQaReport` 0.05 USD, `browserGamePlaytest` 0.10 USD, `androidFlowSmokeTest` 0.15 USD

## 추가 USDC 리드

- GitWork: GitHub issue label 방식으로 `gitwork:usdc:50` 같은 USDC 바운티를 만들고, PR merge 시 Solana 기반 payout 구조를 설명함.
- Superteam Earn: crypto 프로젝트의 bounties/projects/grants 참여 후 paid work를 얻는 구조. 최근 공개 표면에서 200-500 USDC급 글/개발/리서치형 작업이 보임.
- Virtuals ACP: 공식 whitepaper상 성공 Job의 service fee가 USDC로 정산되는 구조. 현재 ACP marketplace에서도 0.01-5.00 USDC offering들이 관찰됨.
