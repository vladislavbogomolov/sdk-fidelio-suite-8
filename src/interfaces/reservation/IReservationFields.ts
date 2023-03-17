import {
    GuestFirstname,
    GuestName,
    ProfileID,
    Guest3rdPartyID,
    Name2,
    GuestNum,
    RoomType,
    ReservationState,
    ReservationStatus,
    ReservationComment1,
    ReservationComment2,
    RoomNum,
    GuestArrival,
    GuestDeparture,
    CheckinDateTime,
    CheckoutDateTime,
    ReservationType,
    NoAvailReason,
    PaymentMethod,
    CrsSystem,
    CrsResNumber,
    NoOfRooms,
    NoOfAdults,
    RateCode,
    RateValue,
    ForeignRateValue,
    ForeignTotalStay,
    CurrencyCode,
    MarketCode,
    CompanyID,
    TotalStay,
    TravelAgentID,
    SourceID,
    BookerID,
    CompanyName,
    Share,
    SourceName,
    SourceCode,
    TravelAgentName,
    BookerName,
    HasShare,
    Child,
    ChannelCode,
    CustomField,
    ReservationAttribute,
    ReservationDetails,
    ReservationPreferences,
    AccompanyingGuests,
    Guarantee,
    GroupID,
    GroupName,
    BedReservation,
    BlockCode,
    NetRoomRevenue,
    DetailDate,
    PartyID,
    PartyName,
    PartyMember,
    PartyReservation,
    ResStatusPriorCXL,
    OptionDate,
    Policy,
    Hints,
    ReservationPreference,
    AccompanyingGuest,
    SendConfirmation,
    AllowRoomOverbooking,
    AllowHouseOverbooking,
    Waitlist,
    PackageCode,
    ApprovalAmount,
    ApprovalCode,
    CreditCardCode,
    ExpiryYear,
    ExpiryMonth,
    CardholderName,
    CreditCardNo,
    RateRoomType,
} from "../types"
import {Note} from "../../models/Note";


export interface IReservation {
    readonly GuestNum: GuestNum,
    readonly GuestFirstname: GuestFirstname,
    readonly GuestName: GuestName,
    Name2: Name2,
    RoomType: RoomType,
    RoomNum: RoomNum,
    GuestArrival: GuestArrival,
    GuestDeparture: GuestDeparture,
    readonly ReservationState: ReservationState,
    readonly ReservationStatus: ReservationStatus,
    ReservationComment1: ReservationComment1,
    ReservationComment2: ReservationComment2,
    readonly CheckinDateTime: CheckinDateTime,
    readonly CheckoutDateTime: CheckoutDateTime,
    ReservationType: ReservationType,
    NoAvailReason: NoAvailReason,
    ProfileID: ProfileID,
    PaymentMethod: PaymentMethod,
    CrsSystem: CrsSystem,
    CrsResNumber: CrsResNumber,
    Notes: Note[],
    NotesList: any,
    NoOfRooms: NoOfRooms,
    NoOfAdults: NoOfAdults,
    RateCode: RateCode,
    RateValue: RateValue,
    ForeignRateValue: ForeignRateValue,
    CurrencyCode: CurrencyCode,
    MarketCode: MarketCode,
    CompanyID: CompanyID,
    TravelAgentID: TravelAgentID,
    SourceID: SourceID,
    BookerID: BookerID,
    CompanyName: CompanyName,
    TravelAgentName: TravelAgentName,
    SourceName: SourceName,
    BookerName: BookerName,
    HasShare: HasShare,
    ReservationAttribute: ReservationAttribute,
    Child: Child,
    SourceCode: SourceCode,
    ChannelCode: ChannelCode,
    AccompanyingGuests: AccompanyingGuests,
    AccompanyingGuest: AccompanyingGuests[],
    GroupName: GroupName,
    GroupID: GroupID,
    Guarantee: Guarantee,
    TotalStay: TotalStay,
    ForeignTotalStay: ForeignTotalStay,
    BlockCode: BlockCode,
    NetRoomRevenue: NetRoomRevenue,
    ReservationDetails: ReservationDetails,
    DetailDate: DetailDate,
    PartyID: PartyID,
    PartyName: PartyName,
    PartyReservation: PartyReservation,
    PartyMember: PartyMember,
    Share: Share,
    ResStatusPriorCXL: ResStatusPriorCXL,
    OptionDate: OptionDate,
    CustomField: CustomField,
    Guest3rdPartyID: Guest3rdPartyID,
    ReservationPreferences: ReservationPreferences,
    Policy: Policy,
    BedReservation: BedReservation,
    Hints: Hints,

}

export type IReservationFields = keyof IReservation


export interface IReservationInsert {
    RoomType: RoomType,
    RoomNum: RoomNum,
    GuestArrival: GuestArrival,
    GuestDeparture: GuestDeparture,
    ReservationComment1: ReservationComment1,
    ReservationComment2: ReservationComment2,
    ProfileID: ProfileID,
    PaymentMethod: PaymentMethod,
    CrsSystem: CrsSystem,
    CrsResNumber: CrsResNumber,
    NoOfRooms: NoOfRooms,
    NoOfAdults: NoOfAdults,
    RateCode: RateCode,
    RateValue: RateValue,
    ForeignRateValue: ForeignRateValue,
    CurrencyCode: CurrencyCode,
    MarketCode: MarketCode,
    CompanyID: CompanyID,
    TravelAgentID: TravelAgentID,
    SourceID: SourceID,
    BookerID: BookerID,
    ReservationAttribute: ReservationAttribute,
    Child: Child,
    SourceCode: SourceCode,
    ChannelCode: ChannelCode,
    Guarantee: Guarantee,
    GroupID: GroupID,
    CreditCardNo: CreditCardNo,
    ExpiryMonth: ExpiryMonth,
    ExpiryYear: ExpiryYear,
    CardholderName: CardholderName,
    CreditCardCode: CreditCardCode,
    ApprovalCode: ApprovalCode,
    ApprovalAmount: ApprovalAmount,
    BlockCode: BlockCode,
    OptionDate: OptionDate,
    PackageCode: PackageCode,
    CustomField: CustomField,
    Waitlist: Waitlist,
    RateRoomType: RateRoomType,
    AllowHouseOverbooking: AllowHouseOverbooking,
    AllowRoomOverbooking: AllowRoomOverbooking,
    SendConfirmation: SendConfirmation,
    AccompanyingGuest: AccompanyingGuest,
    ReservationPreference: ReservationPreference,
    Policy: Policy,
}

export type IReservationInsertFields = keyof IReservationInsert;

export interface IReservationUpdate {
    RoomType?: RoomType,
    RoomNum?: RoomNum,
    GuestArrival?: GuestArrival,
    GuestDeparture?: GuestDeparture,
    ReservationComment1?: ReservationComment1,
    ReservationComment2?: ReservationComment2,
    ProfileID?: ProfileID,
    PaymentMethod?: PaymentMethod,
    CrsSystem?: CrsSystem,
    CrsResNumber?: CrsResNumber,
    NoOfRooms?: NoOfRooms,
    NoOfAdults?: NoOfAdults,
    RateCode?: RateCode,
    RateValue?: RateValue,
    ForeignRateValue?: ForeignRateValue,
    CurrencyCode?: CurrencyCode,
    MarketCode?: MarketCode,
    CompanyID?: CompanyID,
    TravelAgentID?: TravelAgentID,
    SourceID?: SourceID,
    BookerID?: BookerID,
    ReservationAttribute?: ReservationAttribute,
    Child?: Child,
    SourceCode?: SourceCode,
    ChannelCode?: ChannelCode,
    Guarantee?: Guarantee,
    GroupID?: GroupID,
    CreditCardNo?: CreditCardNo,
    ExpiryMonth?: ExpiryMonth,
    ExpiryYear?: ExpiryYear,
    CardholderName?: CardholderName,
    CreditCardCode?: CreditCardCode,
    ApprovalCode?: ApprovalCode,
    ApprovalAmount?: ApprovalAmount,
    BlockCode?: BlockCode,
    OptionDate?: OptionDate,
    PackageCode?: PackageCode,
    CustomField?: CustomField,
    Waitlist?: Waitlist,
    AccompanyingGuest?: AccompanyingGuest,
    ReservationPreference?: ReservationPreference,
    Policy?: Policy,
    Notes: any
}


export type IReservationUpdateFields = keyof IReservationUpdate;