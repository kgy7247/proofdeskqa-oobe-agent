# Gibwork UX Roast Submission

Prepared: 2026-06-02 KST

Task:

- Platform: Gibwork
- Task title: `One screenshot UX roast`
- Task URL: `https://app.gib.work/tasks/0ea0a7c7-c7bf-4aae-8bfe-2fd7e8614e8e`

Selected screen:

- Account settings / connected accounts mobile screen
- Annotated screenshot: `output/gibwork-ux-roast-annotated-20260602.png`

Submission copy:

I selected the account settings / connected accounts mobile screen and attached an annotated screenshot.

5 UX observations:

1. The selected `Account` tab is too subtle. Active and inactive states are visually close, so the settings navigation is harder to scan than it should be.
2. The `Name` field dominates the page but has no nearby save action or completion feedback, so the section reads like unfinished work.
3. The `Email address` card repeats identity information and uses a full block of vertical space without helping the user complete the setup flow.
4. Connected accounts are the real success state here, but the rows do not explain what each connection unlocks and the green checks are too easy to miss.
5. Large card spacing pushes the most important completion signal below the fold, even though this screen is mostly about confirming readiness.

Quick win:

- Add a compact setup summary above the fold that shows connected accounts count, wallet state, and the next recommended action.

Bigger fix:

- Restructure settings into task-oriented modules instead of static cards. `Account`, `Wallet`, and `Connected Accounts` should each expose status, risk, and one clear next action.

Artifact links:

- Annotated screenshot (repo): `https://github.com/kgy7247/proofdeskqa-oobe-agent/blob/main/output/gibwork-ux-roast-annotated-20260602.png`
