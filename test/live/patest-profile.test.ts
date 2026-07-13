import {afterAll, describe, expect, test} from '@jest/globals';
import {Fidelio, FidelioError, ProfileCondition} from '../../src';
import {connectionFromEnv} from '../helpers/connection';

/**
 * Live profile lifecycle against the PATEST test property. Self-contained:
 * creates its own profile, mutates it, and soft-deletes it (DeleteCode=1).
 *
 * SAFETY GATE: these tests WRITE to the configured property, so they only run
 * when the connection URL clearly points at the PATEST test instance (or
 * LIVE_WRITE_TESTS=1 explicitly overrides). Never point them at production.
 */

const connection = connectionFromEnv();
const isWriteSafe = /PATEST/i.test(connection.URL) || process.env.LIVE_WRITE_TESTS === '1';
const liveDescribe = connection.URL && isWriteSafe ? describe : describe.skip;

const stamp = Math.random().toString(36).slice(2, 10);
const testName = `SDK-TEST-${stamp}`;

liveDescribe('PATEST profile lifecycle (live)', () => {

    const fidelio = new Fidelio(connection);
    let profileId = 0;

    afterAll(async () => {
        // Best-effort cleanup: soft-delete whatever the suite created.
        if (profileId > 0) {
            const record = await fidelio.Profile.find(profileId, ['ProfileID', 'DeleteCode']);
            record.set({DeleteCode: 1});
            await record.save({refetch: false});
        }
    });

    test('create() returns a hydrated, connection-bound instance', async () => {
        const created = await fidelio.Profile.create({
            ProfileType: 2,
            ProfileCategory: 4,
            GuestName: testName,
            GuestFirstname: 'Golden',
            Email: `sdk-test-${stamp}@example.com`,
            City: 'Testville',
            CountryISO2: 'IT',
        });

        profileId = Number(created.data.ProfileID);
        expect(profileId).toBeGreaterThan(0);
        expect(created.data.GuestName).toBe(testName);
        // The parser reserves City/Street/Country names for address grouping:
        // they surface ONLY inside Addresses[], never at the top level.
        expect(created.data.Addresses[0].City).toBe('Testville');
        expect(created.data.Addresses[0].CountryISO3).toBe('ITA');
        expect(Array.isArray(created.data.Communications)).toBe(true);
    });

    test('find(id, fields) fetches the requested subset', async () => {
        const slim = await fidelio.Profile.find(profileId, ['ProfileID', 'GuestName', 'Email']);
        expect(slim.data.ProfileID).toBe(profileId);
        expect(slim.data.GuestName).toBe(testName);
        expect(slim.data.Email).toBe(`sdk-test-${stamp}@example.com`);
    });

    test('save() sends only changed whitelisted fields and refetches', async () => {
        const record = await fidelio.Profile.find(profileId);
        record.data.GuestFirstname = 'Silver';
        const updated = await record.save();
        expect(updated.data.GuestFirstname).toBe('Silver');
        expect(updated.data.ProfileID).toBe(profileId);
    });

    test('save({refetch: false}) applies the update in one round trip', async () => {
        // NB: GuestComment is NOT usable here — Fidelio requires a mandatory
        // Date attribute on that element which the SDK does not serialize yet
        // ("Missing mandatory attribute Date for the GuestComment element").
        const record = await fidelio.Profile.find(profileId);
        record.data.Department = `updated-${stamp}`;
        const same = await record.save({refetch: false});
        expect(same).toBe(record);

        const fresh = await fidelio.Profile.find(profileId, ['ProfileID', 'Department']);
        expect(fresh.data.Department).toBe(`updated-${stamp}`);
    });

    test('non-OK server answers surface as FidelioError with a status', async () => {
        // ProfileGlobalID is filled by Central-sync, not by profile updates;
        // on PATEST (no MAS link) the attempt trips a server-side trigger.
        // Contract under test: whatever the server refuses comes back as a
        // typed FidelioError carrying the Fidelio status code.
        const probe = fidelio.Profile
            .addProfileUpdateRequest(new ProfileCondition().add('ProfileID', profileId), {ProfileGlobalID: 424242} as never)
            .send();

        await expect(probe).rejects.toBeInstanceOf(FidelioError);
        await expect(probe.catch((e: FidelioError) => e.status)).resolves.toMatch(/^[A-Z]{2}$/);

        const after = await fidelio.Profile.find(profileId, ['ProfileID', 'ProfileGlobalID']);
        expect(after.data.ProfileGlobalID).toBe(0);
    });

    test('soft delete via DeleteCode persists', async () => {
        const record = await fidelio.Profile.find(profileId, ['ProfileID', 'DeleteCode']);
        record.set({DeleteCode: 1});
        await record.save({refetch: false});

        const gone = await fidelio.Profile.find(profileId, ['ProfileID', 'DeleteCode']);
        expect(gone.data.DeleteCode).toBe(1);

        // restore for afterAll idempotence
        expect(gone.data.ProfileID).toBe(profileId);
    });

});
