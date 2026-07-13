import {describe, expect, test} from '@jest/globals';
import {fidelioFromEnv} from "../helpers/connection";

const testProfileID = Number(process.env.TEST_PROFILE_PRIMARY)

describe('Profile', () => {

    test('Find profile', async () => {
        const res = await fidelioFromEnv().Profile.find(testProfileID)
        expect(res.data.ProfileID).toBe(testProfileID);

        expect(res.data).toEqual(
            expect.objectContaining({
                GuestFirstname: expect.any(String),
                GuestName: expect.any(String),
                ProfileID: expect.any(Number),
                ProfileType: expect.any(Number),
                ProfileCategory: expect.any(Number),
            })
        )
    })

});
