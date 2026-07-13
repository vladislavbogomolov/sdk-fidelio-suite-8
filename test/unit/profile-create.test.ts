import {afterEach, describe, expect, jest, test} from '@jest/globals';
import {Profile, IConnection} from '../../src';
import {axiosApiInstance} from '../../src/requests/client/client';

const connection: IConnection = {
    URL: 'http://example.invalid',
    FIDELIO_USERNAME: 'U',
    FIDELIO_PASSWORD: 'P',
    FIDELIO_VENDOR: 'V',
};

/**
 * Regression for the profile-globalization race: with TryToGlobalize the
 * GlobalID arrives synchronously in the insert response, but the re-find
 * races Central-sync on the property and can read ProfileGlobalID = 0,
 * which made consumers retry and mint duplicate global profiles on MAS.
 */
describe('Profile.create() GlobalID backfill', () => {

    const mockPost = (insertData: any, findRow: any) =>
        jest.spyOn(axiosApiInstance, 'post')
            .mockResolvedValueOnce({data: insertData})
            .mockResolvedValueOnce({data: [findRow]});

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('backfills ProfileGlobalID when the re-find loses the race', async () => {
        mockPost(
            {ProfileID: 1263535, ProfileGlobalID: 10132298},
            {ProfileID: 1263535, ProfileGlobalID: 0, GuestName: 'Doe'},
        );

        const created = await new Profile().setConnection(connection).create({
            ProfileType: 1, ProfileCategory: 1, GuestFirstname: 'John', TryToGlobalize: 1,
        });

        expect(created.data.ProfileGlobalID).toBe(10132298);
        expect(created.data.ProfileID).toBe(1263535);
    });

    test('keeps the server value when the re-find already sees a GlobalID', async () => {
        mockPost(
            {ProfileID: 1263535, ProfileGlobalID: 10132298},
            {ProfileID: 1263535, ProfileGlobalID: 10132298, GuestName: 'Doe'},
        );

        const created = await new Profile().setConnection(connection).create({
            ProfileType: 1, ProfileCategory: 1, GuestFirstname: 'John', TryToGlobalize: 1,
        });

        expect(created.data.ProfileGlobalID).toBe(10132298);
    });

    test('without a GlobalID in the insert response nothing is backfilled', async () => {
        mockPost(
            {ProfileID: 1263535},
            {ProfileID: 1263535, ProfileGlobalID: 0, GuestName: 'Doe'},
        );

        const created = await new Profile().setConnection(connection).create({
            ProfileType: 1, ProfileCategory: 1, GuestFirstname: 'John',
        });

        expect(created.data.ProfileGlobalID).toBe(0);
    });

});
