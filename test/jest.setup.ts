// The npm test scripts pin TZ=UTC in the environment (a runtime
// process.env.TZ change is not reliably picked up by V8), so datetime
// normalization in golden tests is deterministic across machines/CI.

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv/config');
