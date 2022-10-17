import {describe, expect, test} from '@jest/globals';
import {Profile} from "../../src/models/Profile";


const testProfileID = Number(process.env.TEST_PROFILE_PRIMARY)
describe('Profile', () => {

    test('Find profile', async () => {
        const res = await new Profile().find(testProfileID)
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
