# AI Work Proof Desk

Solana 결제 주소를 포함한 작업 수주 페이지와 Phaser 기반 플레이어블 증거 데모입니다.

```powershell
npm install
npm run dev
```

열리는 로컬 URL에서 다음을 확인합니다.

- Solana 주소 복사 버튼
- `Proof Runner` 2D 데모
- Android QA와 AI 검증 작업 제안 문구
- 공개 Solana 바운티 리드 문서
- Virtuals ACP live agent status and job delivery templates

## Live Virtuals Agent

`ProofDeskQA` is registered on Virtuals ACP:

- `docs/virtuals-live-agent.md`
- `docs/job-delivery-templates.md`
- `docs/superteam-agent.md`
- `docs/revenue-status.md`

## Superteam Agent

```powershell
powershell -ExecutionPolicy Bypass -File scripts/check-superteam-agent.ps1
```

## Revenue Checks

```powershell
npm run wallets:check
```

## OOBE Bounty Demo

```powershell
npm run bounty:oobe:demo
npm run bounty:oobe:ready
npm run bounty:oobe:report
```

See `docs/oobe-submission-package.md` and `output/oobe-agent-run.json`.

## Android QA probe

Android 대상이 생기면 다음 명령으로 에뮬레이터 연결 상태와 adb 사용 가능 여부를 먼저 확인합니다.

```powershell
npm run android:probe
```
