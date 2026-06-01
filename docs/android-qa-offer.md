# Android QA 납품 형식

## 입력

- APK 또는 Gradle 프로젝트
- 테스트할 패키지명
- 확인할 사용자 흐름

## 실행 증거

- `adb devices`
- 앱 설치 또는 실행 명령
- UI 트리 요약
- 주요 화면 스크린샷
- crash/logcat 발췌

## 리포트 형식

| 등급 | 위치 | 재현 절차 | 실제 결과 | 기대 결과 | 근거 |
| --- | --- | --- | --- | --- | --- |
| Critical/High/Medium/Low | 화면/기능명 | 번호 목록 | 관찰된 현상 | 정상 동작 | 스크린샷, UI tree, logcat |

## 검수 기준

- 좌표 탭은 스크린샷 추측이 아니라 UI tree bounds 기반으로 산출
- 스크롤 영역은 최소 1회 재덤프 후 판단
- 크래시 여부는 crash buffer 또는 앱 프로세스 logcat으로 확인
