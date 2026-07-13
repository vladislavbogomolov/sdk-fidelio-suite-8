import {describe, expect, test} from '@jest/globals';
import {fidelioFromEnv} from "../helpers/connection";

describe('Custom Fields', () => {

    jest.setTimeout(20000);

    test('Get CustomFields from XCMS', async () => {

        const result = await fidelioFromEnv().CustomQuery.get('XCMS', ['XCMS_NAME3'])

        expect(result.data.length).toBeGreaterThan(0);

        expect(result.data).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining({
                        XCMS_NAME3: expect.any(String),
                    })
                ]
            )
        )
    });

});
