import {describe, expect, test} from '@jest/globals';
import {AvailabilityForWeb} from "../../src/models/AvailabilityForWeb";


describe('Get availability', () => {

    jest.setTimeout(20000);
    test('Get availability', async () => {

        const result = await new AvailabilityForWeb({
            GuestArrival: new Date('2023-06-01'),
            GuestDeparture: new Date('2023-06-05'),
            NoOfAdults: 1
        }).get()

        expect(result.data.length).toBeGreaterThan(0);

        expect(result.data).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining({
                        RateCode: expect.any(String),
                        RoomType: expect.any(String),
                        RoomTypeDesc: expect.any(String),
                        RoomTypeLongDesc: expect.any(String),
                        RoomTypeShortMobileDesc: expect.any(String),
                        RoomTypeLongMobileDesc: expect.any(String),
                        RoomTypeExtDesc: expect.any(String),
                        RoomTypeExtMobileDesc: expect.any(String),
                        Date: expect.any(String),
                        Price: expect.any(Number),
                        PackagePrice: expect.any(Number),
                        CurrencyCode: expect.any(String),
                        CurrencyISO3: expect.any(String),
                        DepartmentCode: expect.any(Number),
                        BaseCurrencyPrice: expect.any(Number),
                        Availability: expect.any(Number),
                        RateMarket: expect.any(String),
                    })
                ]
            )

        )
    });

});
