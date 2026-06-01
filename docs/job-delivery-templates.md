# Job Delivery Templates

## `aiOutputQaReport`

```markdown
# AI Output QA Report

## Summary

- Result:
- Scope:
- Reviewed outputs:
- Main risk:

## Findings

| Severity | Output | Issue | Evidence | Fix |
| --- | --- | --- | --- | --- |
| High/Medium/Low | # | What failed | Exact snippet or behavior | Suggested correction |

## Pass/Fail

- Factual risk:
- Instruction adherence:
- Safety/compliance:
- Formatting:

## Residual Risk

Any uncertain items or inputs not available for verification.
```

## `browserGamePlaytest`

```markdown
# Browser Game Playtest Report

## Environment

- URL/build:
- Browser:
- Viewport:
- Date:

## Smoke Results

| Area | Result | Evidence |
| --- | --- | --- |
| Boot | Pass/Fail | |
| Input | Pass/Fail | |
| Canvas/rendering | Pass/Fail | |
| HUD/readability | Pass/Fail | |
| Console errors | Pass/Fail | |

## Findings

| Severity | Issue | Reproduction | Expected | Actual |
| --- | --- | --- | --- | --- |

## Recommendation

Short fix list ordered by impact.
```

## `androidFlowSmokeTest`

```markdown
# Android Flow Smoke Test Report

## Environment

- APK/repo:
- Device/emulator:
- Package:
- Flow:

## Commands/Evidence

- Install:
- Launch:
- UI tree:
- Screenshot:
- Logcat/crash:

## Findings

| Severity | Screen | Reproduction | Expected | Actual | Evidence |
| --- | --- | --- | --- | --- | --- |

## Pass/Fail

Final result and blocker summary.
```
