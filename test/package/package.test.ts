import {describe, expect, test} from '@jest/globals';
import {Package} from "../../src/models/Package";


describe('Packages', () => {

    test('Get packages', async () => {

        const result = await new Package().where('StartDate', '01.06.2023')
            .where('EndDate', '10.06.2023')
            .get()
        expect(result.data.length).toBeGreaterThan(0);
    });

});
