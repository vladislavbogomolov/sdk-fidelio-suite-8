import {afterEach, describe, expect, jest, test} from '@jest/globals';
import {IConnection, Profile, Reservation} from '../../src';
import {axiosApiInstance} from '../../src/requests/client/client';

const connection: IConnection = {
    URL: 'http://example.invalid',
    FIDELIO_USERNAME: 'U',
    FIDELIO_PASSWORD: 'P',
    FIDELIO_VENDOR: 'V',
};

describe('save/create with refetch: false', () => {

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('update sends one request and returns the same, synced instance', async () => {
        const post = jest.spyOn(axiosApiInstance, 'post').mockResolvedValue({data: []});

        const reservation = new Reservation({GuestNum: 1, ReservationComment1: 'a'}).setConnection(connection);
        reservation.data.ReservationComment1 = 'b';

        const saved = await reservation.save({refetch: false});

        expect(saved).toBe(reservation);
        expect(saved.data.ReservationComment1).toBe('b');
        expect(post).toHaveBeenCalledTimes(1);

        // the snapshot is synced: a second save has nothing to send
        await reservation.save({refetch: false});
        expect(post).toHaveBeenCalledTimes(1);
    });

    test('insert hydrates from the insert response without a re-find', async () => {
        const post = jest.spyOn(axiosApiInstance, 'post')
            .mockResolvedValue({data: {GuestNum: 555, RoomType: 'DBL'}});

        const created = await new Reservation().setConnection(connection).create({
            RoomType: 'DBL',
            GuestArrival: '2025-06-01',
            GuestDeparture: '2025-06-04',
            ProfileID: 1,
            NoOfRooms: 1,
            NoOfAdults: 2,
            RateCode: 'RACK',
        }, {refetch: false});

        expect(created.data.GuestNum).toBe(555);
        expect(post).toHaveBeenCalledTimes(1);
    });

    test('Profile.create keeps the synchronously assigned GlobalID', async () => {
        const post = jest.spyOn(axiosApiInstance, 'post')
            .mockResolvedValue({data: {ProfileID: 1263535, ProfileGlobalID: 10132298}});

        const created = await new Profile().setConnection(connection).create({
            ProfileType: 1, ProfileCategory: 1, GuestFirstname: 'John', TryToGlobalize: 1,
        }, {refetch: false});

        expect(created.data.ProfileID).toBe(1263535);
        expect(created.data.ProfileGlobalID).toBe(10132298);
        expect(post).toHaveBeenCalledTimes(1);
    });

});
