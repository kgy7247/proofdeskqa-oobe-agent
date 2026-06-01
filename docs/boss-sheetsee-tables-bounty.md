# Boss Bounty: sheetsee-tables #24

Status checked: 2026-06-02 KST

## Target

- Platform: Boss
- Boss bounty URL: `https://www.boss.dev/issues/github/MDU6SXNzdWUyODMyMjAyNzc=`
- GitHub issue: `https://github.com/jlord/sheetsee-tables/issues/24`
- Repository: `https://github.com/jlord/sheetsee-tables`
- Listed bounty: `$100`
- Issue status: open and unlocked at the time of check.

## Patch Prepared

- Local clone: `external/sheetsee-tables`
- Patch file: `output/boss-sheetsee-tables-24-readme.patch`
- Report: `output/boss-sheetsee-tables-24-report.json`
- Fork branch: `kgy7247/sheetsee-tables:fix-readme-table-walkthrough`
- Commit: `7e073ff`
- Pull request: `https://github.com/jlord/sheetsee-tables/pull/68`

Patch scope:

- Adds a step-by-step table manual with inline spreadsheet-like data.
- Fixes `Sheetsee,js` to `Sheetsee.js`.
- Fixes broken clear-link examples from `class=".clear"` to `class="clear"`.
- Fixes README template ID mismatch from `tableTemplate` to `siteTable_template`, matching the JavaScript option.

## Verification

- `npm install`: completed, with old dependency vulnerability warnings.
- `npm run bfy`: passed.
- `npm run lint`: failed on pre-existing style issues in `test/browserify.js` and `test/data.js`; the patch only changes `README.md`.

## Submission Blocker

Boss pays when a GitHub PR is merged. The PR is now open, but this patch is not counted as revenue until the upstream PR is merged and Boss marks the bounty paid.
