import {describe, expect, test} from '@jest/globals';
import {AvailabilityForWeb} from "../../src/models/AvailabilityForWeb";
import {IFieldsRequestAvailabilityForWeb} from "../../src/interfaces/availability";
import {Fidelio} from "../../src";
import {Connections} from "../../src/config/connections";


describe('Get availability', () => {

    jest.setTimeout(20000);
    test('Get availability', async () => {

        const reqFields: IFieldsRequestAvailabilityForWeb = {
            GuestArrival: new Date('2024-06-01'),
            GuestDeparture: new Date('2024-06-03'),
            NoOfAdults: 2,
            MultipleRates: 1,
            AvailabilityLimit: 'BookingOnline',
            WebOnly: 1
        }

        const connection = new Fidelio(Connections[0]);
        const result = await connection.AvailabilityForWeb.where(reqFields).get()

        console.log(result)

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
