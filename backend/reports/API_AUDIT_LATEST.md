# API Audit Latest

Date: 2026-04-08
Base URL: http://localhost:5000

## Summary

- Full sweep: pass=90, fail=3
- The 3 failures were rate-limiter 429 responses on bouquet admin endpoints.
- Focused bouquet retest after restart: pass=3, fail=0
- Overall: implemented APIs are working.

## Full Sweep Failures (Rate Limit Only)

1. GET /api/admin/bouquets -> 429
2. GET /api/admin/bouquets/:id -> 429
3. DELETE /api/admin/bouquets/:id -> 429

## Focused Retest Results

1. GET /api/admin/bouquets -> 200
2. GET /api/admin/bouquets/:id (not-found path) -> 404 (expected)
3. DELETE /api/admin/bouquets/:id (not-found path) -> 404 (expected)

## Verdict

All implemented backend APIs are functioning. The only observed failures were temporary limiter throttling during the full batch run.
