import {describe, expect, test} from '@jest/globals';
import {Reservation} from "../../src";
import {fidelioFromEnv} from "../helpers/connection";

const testReservationID = Number(process.env.TEST_RESERVATION_ID)
const testReservationNoteAttr = process.env.TEST_RESERVATION_NOTE_ATTR ?? 'NF'

describe('Reservation Note', () => {

    let reservationUpdated: Reservation

    test('Create note', async () => {
        reservationUpdated = await fidelioFromEnv().Reservation.find(testReservationID)
        const notesQty = reservationUpdated.data.Notes?.length ?? 0

        const noteString = Math.random().toString(36).substring(10);

        reservationUpdated.addNote({
            value: noteString,
            attr: testReservationNoteAttr
        })
        reservationUpdated = await reservationUpdated.save()
        expect(reservationUpdated.data.Notes!.length).toBeGreaterThan(notesQty);
        expect(reservationUpdated.data.Notes![notesQty].value).toBe(noteString);
    })

    test('Update note', async () => {
        const noteString = Math.random().toString(36).substring(10);
        reservationUpdated.data.Notes![0].value = noteString
        reservationUpdated = await reservationUpdated.save()
        expect(reservationUpdated.data.Notes![0].value).toBe(noteString);
    })

    test('Delete notes', async () => {
        reservationUpdated = await reservationUpdated.deleteNote('ALL').save()
        expect(reservationUpdated.data.Notes?.length ?? 0).toEqual(0);
    })

});
