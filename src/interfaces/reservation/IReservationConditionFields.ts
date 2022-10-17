import {
    GuestFirstname,
    GuestName,
    IOperators,
    RoomType,
    RoomNum,
    GuestArrival,
    GuestDeparture,
    ReservationState,
    ProfileID,
    ReservationStatus,
    CrsSystem,
    CrsResNumber,
    CompanyID,
    TravelAgentID,
    SourceID,
    BookerID,
    AccompanyingGuest,
    AccompanyingGuestLastName,
    AccompanyingGuestFirstName,
    PartyID,
    Share,
    Guest3rdPartyID,
    LastUpdateTime,
    CreationTime,
    IOperation,
    Guest3rdPartyType,
    GuestNum
} from "../types";

export interface IReservationConditionFieldsX {
    GuestNum: GuestNum,
    ProfileID: ProfileID,
    GuestFirstname: GuestFirstname,
    GuestName: GuestName,
    RoomType: RoomType,
    RoomNum: RoomNum,
    GuestArrival: GuestArrival,
    GuestDeparture: GuestDeparture,
    ReservationState: ReservationState,
    ReservationStatus: ReservationStatus,
    CrsSystem: CrsSystem,
    CrsResNumber: CrsResNumber,
    CompanyID: CompanyID,
    TravelAgentID: TravelAgentID,
    SourceID: SourceID,
    BookerID: BookerID,
    AccompanyingGuest: AccompanyingGuest,
    AccompanyingGuestLastName: AccompanyingGuestLastName,
    AccompanyingGuestFirstName: AccompanyingGuestFirstName,
    PartyID: PartyID,
    Share: Share,
    LastUpdateTime: LastUpdateTime,
    CreationTime: CreationTime,
    Guest3rdPartyID: Guest3rdPartyID,
    Guest3rdPartyType: Guest3rdPartyType,
}

export type IReservationConditionFields = keyof IReservationConditionFieldsX;


export interface IReservationConditionList {
    name: IReservationConditionFields,
    operation: IOperation,
    value: string | number,
    operator: IOperators
}

