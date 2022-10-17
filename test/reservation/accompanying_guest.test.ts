import {describe, expect, test} from '@jest/globals';
import {Reservation} from "../../src/models/Reservation";


const testReservationID = Number(process.env.TEST_RESERVATION_ID)
const testReservationProfileSecondary = Number(process.env.TEST_PROFILE_SECONDARY)

describe('Reservation AccompanyingGuest', () => {


    let reservationUpdated: Reservation


    test('Add AccompanyingGuest', async () => {
        reservationUpdated = await new Reservation().find(testReservationID)

        reservationUpdated = await reservationUpdated.addAccompanyingGuest(testReservationProfileSecondary).save()

        expect(reservationUpdated.data.AccompanyingGuest
            .filter(guest => guest.value === testReservationProfileSecondary).length).toEqual(1);
    })

    test('Delete AccompanyingGuest', async () => {
        reservationUpdated = await reservationUpdated.deleteAccompanyingGuest(testReservationProfileSecondary).save()
        expect(reservationUpdated.data.AccompanyingGuest
            .filter(guest => guest.value === testReservationProfileSecondary).length).toEqual(0);
    })

    test('Add and Delete AccompanyingGuest before save', async () => {
        reservationUpdated = await reservationUpdated.addAccompanyingGuest(testReservationProfileSecondary).deleteAccompanyingGuest(556001).save()
        expect(reservationUpdated.data.AccompanyingGuest
            .filter(guest => guest.value === testReservationProfileSecondary).length).toEqual(0);
    })

});
