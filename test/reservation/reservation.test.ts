import {describe, expect, test} from '@jest/globals';
import {Reservation} from "../../src/models/Reservation";


const testReservationID = Number(process.env.TEST_RESERVATION_ID)
describe('Reservation', () => {

    test('Find reservation', async () => {
        const res = await new Reservation().find(testReservationID)
        expect(res.data.GuestNum).toBe(testReservationID);

        expect(res.data).toEqual(
            expect.objectContaining({
                GuestNum: expect.any(Number),
                GuestFirstname: expect.any(String),
                GuestName: expect.any(String),
                RoomType: expect.any(String),
                RoomNum: expect.any(String),
                GuestArrival: expect.any(String),
                GuestDeparture: expect.any(String),
                ReservationState: expect.any(Number),
                ReservationStatus: expect.any(Number),
                ReservationComment1: expect.any(String),
                ReservationComment2: expect.any(String),
                // CheckinDateTime: expect.anything(),
                // CheckoutDateTime: expect.anything(),
                ReservationType: expect.any(String),
                NoAvailReason: expect.any(Number),
                ProfileID: expect.any(Number),
                PaymentMethod: expect.any(String),
                CrsSystem: expect.any(String),
                CrsResNumber: expect.any(String),
                NoOfRooms: expect.any(Number),
                NoOfAdults: expect.any(Number),
                RateCode: expect.any(String),
                RateValue: expect.any(Number),
                ForeignRateValue: expect.any(Number),
                CurrencyCode: expect.any(String),
                MarketCode: expect.any(String),
                CompanyID: expect.any(Number),
                TravelAgentID: expect.any(Number),
                SourceID: expect.any(Number),
                BookerID: expect.any(Number),
                TravelAgentName: expect.any(String),
                SourceName: expect.any(String),
                BookerName: expect.any(String),
                SourceCode: expect.any(String),
                ChannelCode: expect.any(String),
                GroupName: expect.any(String),
                GroupID: expect.any(Number),
                Guarantee: expect.any(String),
                TotalStay: expect.any(Number),
                ForeignTotalStay: expect.any(Number),
                NetRoomRevenue: expect.any(Number),
                PartyID: expect.any(Number),
                PartyName: expect.any(String),
            })
        )
    })

    test('Get reservations', async () => {
        const reservations = await new Reservation().where('GuestArrival', '01.06.2023', 'ge').get()
        expect(reservations.length).toBeGreaterThan(1)
    })

});


describe('Update Reservation', () => {
    const reservation = new Reservation()
    test('ReservationComment1 & ReservationComment2', async () => {
        const res = await reservation.find(testReservationID)
        const testNumber = Math.random().toString(36).substring(7);
        res.data.ReservationComment1 = testNumber;
        res.data.ReservationComment2 = testNumber;
        await res.save()
        const resUpdated = await reservation.find(testReservationID)
        expect(resUpdated.data.ReservationComment2).toBe(testNumber);
    });

    test('Update NoOfAdults', async () => {
        const res = await reservation.find(testReservationID);
        res.data.NoOfAdults = [1,2].find( num => num !== res.data.NoOfAdults );
        await res.save()
        let resUpdated = await reservation.find(testReservationID)
        expect(resUpdated.data.NoOfAdults).toBe(res.data.NoOfAdults);

    });
});

