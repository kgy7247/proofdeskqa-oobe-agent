# Pyrimid Vendor Lead Discovery Output Patch

Prepared: 2026-06-02 KST

Submission target: MonetizeYourAgent job 25, `Pyrimid bounty: improve vendor-lead-discovery output`.

Settlement wallet: `2ngZYnmBNJNvJsxupQLE1j5GhdKLZfAHse1BkgDxBwWD`

## Summary

The current Pyrimid `vendor-lead-discovery` paid endpoint returns a short static list. The patch in `output/pyrimid-vendor-lead-discovery-output.patch` improves the buyer-agent value of the endpoint by adding:

- Segment-specific lead presets for `mcp`, `agent-frameworks`, and `api-tools`.
- Query-term parsing through `q=`.
- Fit scores and priority ordering.
- Qualifying signals for each vendor lead class.
- Concrete Pyrimid/x402 integration offers.
- Suggested first-contact subject, ask, and proof package.
- Expected USDC per-call price bands.
- A reusable search strategy and scoring model.
- A richer catalog `output_schema` for the paid lead-discovery product.

## Validation

Patch generated from a fresh clone of `https://github.com/pyrimid-ai/pyrimid`.

Commands run inside the Pyrimid clone:

```powershell
git diff --check
npm install
npm run build
```

Result:

- `git diff --check`: passed.
- `npm install`: passed; npm reported existing dependency audit findings.
- `npm run build`: passed with Next.js production build and type checking.
- Build warning observed: Next.js inferred the parent workspace root because this repo is nested under another checkout with a lockfile. This does not indicate a patch compile failure.

## Files Changed

- `app/api/v1/paid/[product]/route.ts`
- `lib/seed-products.ts`

## Patch File

See `output/pyrimid-vendor-lead-discovery-output.patch`.
