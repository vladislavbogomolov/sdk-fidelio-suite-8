# sdk-fidelio-suite

TypeScript SDK for the **Oracle Hospitality Suite 8 (Fidelio)** XML interface
(`FidelioXMLInterface.DataHandler`). It speaks Fidelio's V8/ZIP protocol —
request XML is zipped into a `MSG` entry and sent base64-encoded, responses are
unzipped, parsed and normalized into typed objects.

## Install

```bash
npm install sdk-fidelio-suite
```

## Quick start

```ts
import {Fidelio} from "sdk-fidelio-suite";

const fidelio = new Fidelio({
    URL: "https://host/V8CF/fidelioIISWrapper.dll/FidelioXMLInterface.DataHandler?ic=XX",
    FIDELIO_USERNAME: "API",
    FIDELIO_PASSWORD: "...",
    FIDELIO_VENDOR: "myVendor",
});

// Find one reservation
const reservation = await fidelio.Reservation.find(42447);
console.log(reservation.data.GuestName);

// Query with conditions (Fidelio dates are DD.MM.YYYY)
const arrivals = await fidelio.Reservation
    .where("GuestArrival", "01.06.2025", "ge")
    .get();

// Update: mutate the working copy, save() sends only the changed,
// updatable fields and returns a freshly fetched instance
reservation.data.ReservationComment1 = "VIP arrival";
const updated = await reservation.save();

// Create profile + notes / memberships
const profile = await fidelio.Profile.create({
    ProfileType: 1,
    ProfileCategory: 1,
    GuestName: "Doe",
    GuestFirstname: "John",
    Email: "john@example.com",
    CountryISO2: "IT",
});

// Availability
const availability = await fidelio.AvailabilityForWeb.where({
    GuestArrival: new Date("2025-06-01"),
    GuestDeparture: new Date("2025-06-04"),
    NoOfAdults: 2,
    NoOfRooms: 1,
}).get();

// Arbitrary table access
const custom = await fidelio.CustomQuery.get("XCMS", ["XCMS_NAME3"]);
```

Available facade entities: `Reservation`, `Profile`, `CreateProfileAndReservation`,
`Packages`, `Posting`, `AvailabilityForWeb`, `ChildrenCategories`, `RateList`,
`CustomQuery`.

## Error handling

Non-`OK` responses reject with a `FidelioError` (`Error` subclass):

```ts
import {FidelioError} from "sdk-fidelio-suite";

try {
    await fidelio.Reservation.find(1);
} catch (e) {
    if (e instanceof FidelioError) console.error(e.status, e.message);
}
```

## Debugging

Set the environment variable `DEBUG_ENABLED=true` to log raw request and
response XML to the console.

## Development

```bash
npm run build       # compile to dist/
npm run lint        # ESLint
npm run typecheck   # strict tsc over src + test
npm test            # jest, one-shot (see warning below)
npm run test:watch  # jest watch mode
npm start           # run playground.ts (gitignored scratchpad) with nodemon
```

**Warning:** the test suite consists of live integration tests. They connect to
the Fidelio server configured in `.env` (see `.env.example`) and **modify real
PMS data** (the `TEST_*` records). There are no mocks; do not point them at a
production property.

## Releases

Releases are fully automated with [semantic-release](https://github.com/semantic-release/semantic-release):
every push to `main` with [Conventional Commits](https://www.conventionalcommits.org)
(`fix:` → patch, `feat:` → minor, `BREAKING CHANGE:` → major) publishes to npm,
tags a GitHub release and updates `CHANGELOG.md`. Commit messages are enforced
locally via commitlint + husky.

## License

Apache-2.0
