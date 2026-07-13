# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A TypeScript SDK (published to npmjs as `sdk-fidelio-suite`) for the Fidelio Suite 8 hotel PMS XML interface. It wraps Fidelio's `FidelioXMLInterface.DataHandler` endpoint: request XML is zipped into a `MSG` file and sent base64-encoded (Fidelio's "V8/ZIP" protocol), and responses are unzipped, XML-parsed, and normalized into typed JS objects.

## Commands

- Build: `npm run build` (tsc, strict; output in gitignored `dist/`, which is all the published package ships)
- Lint: `npm run lint` (ESLint 10 flat config, typescript-eslint)
- Typecheck src + tests: `npm run typecheck`
- All tests: `npm test` (one-shot, serial); watch mode: `npm run test:watch`
- Single test file: `npm test test/reservation/note.test.ts`
- Scratchpad: `npm start` runs the gitignored `playground.ts` under nodemon — that file may hold live credentials and must never be committed

### Releases are automated — commit style matters

semantic-release runs on every push to `main` (`.github/workflows/release.yml`): conventional commits drive the version (`fix:` patch, `feat:` minor, `BREAKING CHANGE:` footer major), publish to npmjs (needs the `NPM_TOKEN` repo secret), the GitHub release, and `CHANGELOG.md`. commitlint + husky enforce the message format locally. Baseline tag: `v1.0.106`.

### Tests are live integration tests

There are no mocks: tests hit a real Fidelio server configured via `.env` (see `.env.example`; `test/helpers/connection.ts` builds the `IConnection`). Update suites **mutate real PMS data** (the `TEST_*` record ids), and everything runs `--runInBand` because suites share those records — never parallelize or point at production. CI intentionally runs lint/typecheck/build only, never the tests.

## Architecture

The package root (`src/index.ts`) is a pure barrel: the `Fidelio` facade plus every model, condition builder, `FidelioError`, `IConnection`, and the public interface types. `Fidelio` (`src/Fidelio.ts`) is constructed with an `IConnection` (URL + credentials per hotel property; only URL/username/password/vendor are required) and instantiates one model per Fidelio entity, injecting the connection via `setConnection()`. Nothing reads env vars at runtime except the `DEBUG_ENABLED` debug-log flag.

### Request/response pipeline (one round trip)

1. **Models** (`src/models/*`) — ActiveRecord-style. `Reservation` and `Profile` extend `FidelioRecord<T>` (`src/models/FidelioRecord.ts`), which owns the working-copy vs server-snapshot bookkeeping (`_attributes`/`_original`), `changedFields()` diffing, and note handling. `save()` sends only changed fields that appear in the `*updateFields` whitelists (`src/requests/objects/{reservation,profile}/*QueryFields.ts`), then re-`find()`s and returns a fresh instance. `find()`/`get()` also return new connection-bound instances with the primary key (`GuestNum`/`ProfileID`) preloaded as a condition. Simpler read-model classes (Package, RateList, CustomQuery, AvailabilityForWeb, ChildrenCategories, Posting) extend `FidelioRequest` directly.

2. **Request building** (`src/requests/FidelioRequest.ts`) — `add*Request()` methods accumulate request fragments; `getBody()` wraps them in the `<fidelio><request UserName Password Vendor>` envelope (multiple fragments batch into one HTTP call) and serializes with xml2js; `send()` posts and then drains the queue. Conditions come from the generic `Condition<T>` (`src/requests/objects/Condition.ts`); `PackageCondition` is the free-form variant that also stamps a `dataType` attribute. `Query()` (`objects/builders/query.ts`) assembles method `query` | `insert` | `update` fragments from `Conditions()` (nested link/condition XML), `Fields()`, and `Froms()` (CustomQuery only). Commands (reservation cancel, posting create) are hand-shaped in `objects/commands/commands.ts`.

3. **Transport** (`src/requests/client/client.ts`) — one shared axios instance whose interceptors implement V8/ZIP both ways. Env var `DEBUG_ENABLED=true` traces raw XML.

4. **Response parsing** (`src/responses/index.ts`) — a non-`OK` Status throws `FidelioError` (`.status`, `.message`). `parseField()` coerces values by field-name lists (`fieldsNumberType`, `fieldsDateType` → `YYYY-MM-DD`, `fieldsDateTimeType` → ISO), a `context` dispatch table reshapes attributed multi-valued fields, and street/city/country fields regroup into `Addresses[]`. One batched query returns rows directly; multiple return an array per query.

### The symmetric context-dispatch pattern

Special fields are handled by two mirrored dispatch tables keyed by field name: outbound serialization in the `context` object of `src/requests/objects/builders/field.ts`, inbound parsing in the `context` object of `src/responses/index.ts`. Supporting a new attributed/multi-valued field (Membership, CustomField, Notes, ...) means adding a handler to **both** tables, plus its type in `src/interfaces/` and, if it should be fetched/updated by default, the select list and `*updateFields` whitelist in `src/requests/objects/{profile,reservation}/*QueryFields.ts`.

### Dates

Fidelio's wire format is `DD.MM.YYYY` (sometimes suffixed `.000 UTC-60`). Conditions take it raw — `where('GuestArrival', '01.06.2023', 'ge')` — outbound builders format `Date` objects into it, and parsers normalize inbound values to `YYYY-MM-DD` / ISO strings.

### Wire-format invariant

The emitted XML shape and the parsed response shape are the SDK's contract with live Fidelio servers. When refactoring, preserve them byte-for-byte unless a change is deliberately released as breaking.
