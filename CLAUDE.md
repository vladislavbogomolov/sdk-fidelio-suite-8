# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A TypeScript SDK (published to GitHub Packages as `sdk-fidelio-suite`) for the Fidelio Suite 8 hotel PMS XML interface. It wraps Fidelio's `FidelioXMLInterface.DataHandler` endpoint: request XML is zipped into a `MSG` file and sent base64-encoded (Fidelio's "V8/ZIP" protocol), and responses are unzipped, XML-parsed, and normalized into typed JS objects.

## Commands

- Build: `npm run build` (prebuild runs `tslint --fix` first; output goes to the gitignored `dist/`, which is what the package's `main`/`types` point at)
- All tests: `npm test` — runs jest in **watch mode** (`--watchAll --runInBand`); it does not exit on its own
- Single test file: `npm test test/reservation/note.test.ts` (watch mode), or one-shot: `npx jest test/reservation/note.test.ts --runInBand`
- Manual dev loop: `npm start` — builds, then runs `src/index.ts` under nodemon

### Tests are live integration tests

There are no mocks: tests hit a real Fidelio server using `.env` (see `.env.example`) for credentials and the `TEST_RESERVATION_ID` / `TEST_PROFILE_PRIMARY` / `TEST_PROFILE_SECONDARY` record ids. Update suites **mutate real PMS data** (reservation comments, occupancy), and `--runInBand` is required because suites share those records — never parallelize them. Caveat: the test files still construct models bare (`new Reservation()`) without a connection, predating the connection-injection refactor (the old `FIDELIO_ENDPOINT` baseURL in `src/requests/client/client.ts` is commented out), so expect them to fail until updated to pass a connection.

## Architecture

The package exports a single class, `Fidelio` (`src/Fidelio.ts`) — a façade constructed with an `IConnection` (`src/config/connections.ts`: URL, vendor, username, password per hotel property). It instantiates one model per Fidelio entity (Profile, Reservation, Packages, Posting, CustomQuery, AvailabilityForWeb, ChildrenCategories, RateList, CreateProfileAndReservation) and injects the connection into each via `setConnection()`. Credentials and endpoint travel with the connection object, not env vars.

`src/index.ts` is both the package entry (the `export {Fidelio}` at the bottom must stay) and a dev scratchpad: its top-level statements are throwaway manual calls against real properties, rewritten between commits and run via `npm start`. Don't treat its body as example code to preserve.

### Request/response pipeline (one round trip)

1. **Models** (`src/models/*`) — ActiveRecord-style classes that extend `FidelioRequest`. Fluent API: `where(field, value, operation)` accumulates typed conditions; `find(id)` / `get()` query; `save()` / `create()` / `delete()` write; plus domain mutators (`addNote`/`deleteNote`, `addPackage`/`removePackage`, `addAccompanyingGuest`, ...). Each model keeps `#attributes` (working copy) vs `#original` (server snapshot); `save()` sends only keys that changed **and** are whitelisted in `reservationUpdateFields` / `profileUpdateFields`, then re-`find()`s and returns a fresh instance. `find()`/`get()` likewise return new instances with the primary key (`GuestNum` for Reservation, `ProfileID` for Profile) preloaded as a condition.

2. **Request building** (`src/requests/FidelioRequest.ts`) — `add*Request()` methods push request fragments into `_requestObject[]`; `getBody()` wraps them all in the `<fidelio><request UserName Password Vendor>` envelope (multiple fragments batch into one HTTP call) and serializes with xml2js. Two fragment shapes:
   - **Queries** — `Query()` in `src/requests/objects/builders/query.ts` with method `query` | `insert` | `update`, assembling `Conditions()` (flat condition list → Fidelio's nested `link`/`condition` XML), `Fields()`, and `Froms()` (used only by CustomQuery to name an arbitrary table).
   - **Commands** — hand-shaped objects in `src/requests/objects/commands/commands.ts` (reservation cancel, posting create).

3. **Transport** (`src/requests/client/client.ts`) — one shared axios instance whose interceptors implement the V8/ZIP protocol both ways. Set the env var `DEBUG_ENABLED=true` to trace raw XML (note: `fidelioDebug` reads the env var, not the `IConnection.DEBUG_ENABLED` flag).

4. **Response parsing** (`src/responses/index.ts`) — a non-`OK` Status throws `{status, message}`. Field values are coerced by name-membership in `fieldsNumberType` / `fieldsDateType` (→ `YYYY-MM-DD`) / `fieldsDateTimeType` (→ ISO), attributed multi-valued fields are reshaped by a dispatch table, and street/city/country fields are regrouped into `Addresses[]`. One batched query returns its rows directly; multiple batched queries return an array per query.

### The symmetric context-dispatch pattern

Special fields are handled by two mirrored dispatch tables keyed by field name: outbound serialization in the `context` object of `src/requests/objects/builders/field.ts`, inbound parsing in the `context` object of `src/responses/index.ts`. Supporting a new attributed/multi-valued field (as recent commits did for Membership and CustomField) means adding a handler to **both** tables, plus:
- its type in `src/interfaces/`
- the default select list and the `*updateFields` whitelist (which gates `save()`) in `src/requests/objects/{profile,reservation}/*QueryFields.ts`

### Dates

Fidelio's wire format is `DD.MM.YYYY` (sometimes suffixed `.000 UTC-60`). Conditions take it raw — `where('GuestArrival', '01.06.2023', 'ge')` — outbound builders format `Date` objects into it, and parsers normalize inbound values to `YYYY-MM-DD` / ISO strings.

### Quirks

- `src/interfaces/commamds.ts` — the filename typo is load-bearing; imports reference it as-is.
- The linter is tslint (deprecated), configured in `tslint.json`, run automatically with `--fix` on every build.
- Publishing: the GitHub Actions workflow publishes to GitHub Packages when a GitHub release is created (after `npm ci && npm test`).
