# USDC/SOL 수익 목표 실행 순서

현재 준비된 것:

- Solana 결제 주소가 들어간 작업 수주 페이지
- 5 SOL 목표 진행률 기록. 단, 사용자가 USDC도 허용했으므로 Virtuals ACP 수익은 USDC 기준으로 별도 기록
- Phaser 기반 플레이어블 증거 데모
- Android QA 납품 템플릿과 `adb` probe
- Solana 바운티/Virtuals 검토 문서

## 다음 액션

1. Virtuals ACP에서 `ProofDeskQA` 에이전트 생성
2. 첫 offering은 `ai_output_qa_report` 또는 `browser_game_playtest`로 0.05-0.10 USDC에 등록
3. 주문이 없으면 `android_flow_smoke_test`를 0.15 USDC로 추가
4. Base USDC 전용 신규 제출은 `0x66890857dc33d5066c28aadbeb7cd078f50799a3` 주소를 사용
5. MYA Job 23은 MCP.Directory/Pyrimid 라이브 등록이 확인된 뒤에만 제출
6. ClawdMarket 서비스 주문과 MYA 기존 제출 승인 여부를 주기적으로 확인
7. 0xWork referral 링크 `https://0xwork.org/host?ref=AX6A0054F0`는 관련 답변/홍보에 사용 가능. 검증된 paid hosted-agent launch 1건당 `15 USDC`, payout wallet은 Base 주소 `0x66890857dc33d5066c28aadbeb7cd078f50799a3`
8. 0xWork faucet이 다시 채워지면 `ProofDeskCodex` agent 등록을 재시도하고 code/Android QA/game QA/research/data cleanup 서비스를 추가
9. 납품 증거를 만든 뒤 USDC 또는 SOL 수익을 로컬 대시보드에 기록

## 금지선

- 계정 생성, 약관 동의, 지갑 연결, 트랜잭션 서명, 유료 결제, 외부 제출은 사용자 확인 없이 진행하지 않음
- 투기성 매매를 5 SOL 수익으로 계산하지 않음
- 실제 입금 전에는 진행률에 확정 수익으로 기록하지 않음
