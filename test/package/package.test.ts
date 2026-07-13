import {describe, expect, test} from '@jest/globals';
import {fidelioFromEnv} from "../helpers/connection";

describe('Packages', () => {

    test('Get packages', async () => {

        const result = await fidelioFromEnv().Packages.where('StartDate', '01.06.2023')
            .where('EndDate', '10.06.2023')
            .get()
        expect(result.data.length).toBeGreaterThan(0);
    });

});
