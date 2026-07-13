import {
    FidelioRequest,
    IConnection,
    IProfileUpdateFields,
    IReservationUpdate,
    PackageCondition,
    ProfileCondition,
    ReservationCondition,
} from "../../../src";

export const goldenConnection: IConnection = {
    URL: 'http://example.invalid',
    FIDELIO_USERNAME: 'USER',
    FIDELIO_PASSWORD: 'PASS',
    FIDELIO_VENDOR: 'VENDOR',
    FIDELIO_VERSION: '1.1.0',
};

/**
 * Builds one envelope covering every request shape the SDK can emit.
 * The output is compared byte-for-byte against the golden fixture —
 * it IS the SDK's contract with live Fidelio servers.
 */
export const buildGoldenEnvelope = (): string => {
    const r = new FidelioRequest().setConnection(goldenConnection);

    // query with a single condition
    r.addReservationQueryRequest(new ReservationCondition().add('GuestNum', 239190));

    // query with a chained multi-operator condition list
    r.addReservationQueryRequest(
        new ReservationCondition()
            .add('GuestArrival', '01.06.2023', 'ge')
            .addOr('RoomType', 'DBL')
            .addNot('RoomNum', '101')
            .addAnd('ReservationState', 1, 'neq'),
    );

    // update exercising the special field serializers
    r.addReservationUpdateRequest(new ReservationCondition().add('GuestNum', 239190), {
        ReservationComment1: 'hello',
        NoOfAdults: 2,
        GuestArrival: new Date('2025-06-01T00:00:00'),
        Notes: [{attr: 'NF', noteID: 5, value: 'note text', Delete: 1}],
        AccompanyingGuest: [
            {name: 'AccompanyingGuest', value: 111, action: 'to_create'},
            {name: 'AccompanyingGuest', value: 222, addData: 'DELETE'},
            {name: 'AccompanyingGuest', value: 333}, // neither flag -> must be filtered out
        ],
        PackageCode: [{attr: 'EPE', Price: 10}],
        CustomField: {XCMS_A: 'v1', XCMS_B: 'v2', XCMS_EMPTY: null},
        Child: {CH1: 2, CH2: 0},
    } as unknown as IReservationUpdate);

    // profile query + update via PackageCondition (dataType path)
    r.addProfileQueryRequest(new ProfileCondition().add('ProfileID', 477822));
    r.addProfileUpdateRequest(new PackageCondition().add('ProfileID', 477822), {GuestName: 'Doe'} as IProfileUpdateFields);

    // profile insert with membership
    r.addProfileCreateRequest({
        ProfileType: 1,
        ProfileCategory: 1,
        GuestName: 'Prova SPA',
        GuestFirstname: 'IT',
        Email: 'a@b.c',
        Membership: [{Type: 'PIV', name: 'Membership', value: 'IT98765432112'}],
    });

    // package / custom query / rate list / children categories queries
    r.addPackageRequest(new PackageCondition().add('StartDate', '01.06.2023').addAnd('EndDate', '10.06.2023'));
    r.addCustomQueryRequest(new PackageCondition().addAnd('Y', '1'), 'XCMS', ['XCMS_NAME3']);
    r.addRateListRequest();
    r.addChildrenCategoriesRequest(null);

    // availability
    r.addAvailabilityRequest({
        GuestArrival: new Date('2025-06-01T00:00:00'),
        GuestDeparture: new Date('2025-06-04T00:00:00'),
        NoOfAdults: 2,
        NoOfRooms: 1,
        Child: {CH1: 1},
    });

    // commands
    r.addReservationDelete(1234, {Reason: 'dup', DeleteTraces: 1, SendEmail: 0});
    r.addReservationDelete(5678);
    r.addPostingCreateRequest({GuestNum: 1, DepartmentCode: 2, DepartmentType: 1, Price: 5, Quantity: 1, Comment: 'c'});

    // reservation insert
    r.addReservationInsertRequest({
        RoomType: 'PZSTA',
        GuestArrival: '2023-06-01',
        GuestDeparture: '2023-06-04',
        NoOfAdults: 2,
        NoOfRooms: 1,
        RateCode: 'W98_BB_AS',
        ProfileID: 0,
        MarketCode: 'TUI',
        SourceCode: 'DIR',
        ChannelCode: 'WEB',
        CrsResNumber: '0',
    });

    return r.getBody();
};
