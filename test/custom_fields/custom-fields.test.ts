import {describe, expect, test} from '@jest/globals';
import {CustomQuery} from "../../src/models/CustomQuery";

describe('Custom Fields', () => {


    jest.setTimeout(20000);

    test('Get CustomFields from XCMS', async () => {

        const result = await new CustomQuery().get('XCMS', ['XCMS_NAME3'])

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
