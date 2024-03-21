import {Note} from "../../models/Note";

import {
    AddressGreeting,
    Birthday,
    City,
    GuestFirstname,
    GuestName,
    LetterGreeting,
    ProfileCategory,
    ProfileID,
    ProfileType,
    Street1,
    Street2,
    Street3,
    ZIP,
    State,
    CountryISO2,
    CountryISO3,
    Title,
    Telephone,
    Email,
    Fax,
    Gender,
    DeleteCode,
    CreationTime,
    IncludeNotCommited,
    GuestComment,
    NoEMailing,
    NoMailing,
    LastUpdateTime,
    ProfileAttribute,
    Guest3rdPartyID,
    ProfileExternalID,
    Position,
    Department,
    ProfilePreferences,
    ProfilePreference,
    Membership,
    PersonalDocument,
    BirthPlace,
    LinkedProfile,
    CreditStatusChangeTime,
    CreditReason,
    CreditStatus,
    CentralSyncTime,
    VipCode,
    Language,
    NationalityISO3,
    NationalityISO2,
    ProfileGlobalID, GuestArrival, GuestDeparture, Child, INote,
} from "../types"
import {IReservationInsert} from "../reservation/IReservationFields";
import {IChild} from "../availability";


export interface IProfile {
    ProfileID?: ProfileID,
    GuestFirstname?: GuestFirstname,
    GuestName?: GuestName,
    Name2?: string,
    LoginName?: string,
    LoginPassword?: string,
    CorporateID?: string,
    ProfileType?: ProfileType,
    ProfileCategory?: ProfileCategory,
    Title?: Title
    AddressGreeting?: AddressGreeting,
    LetterGreeting?: LetterGreeting,
    Birthday?: Birthday,
    City?: City,
    Street1?: Street1,
    Street2?: Street2,
    Street3?: Street3,
    ZIP?: ZIP,
    State?: State,
    CountryISO2?: CountryISO2,
    CountryISO3?: CountryISO3,
    Telephone?: Telephone,
    Email?: Email
    EMail?: Email
    MembershipType?: any
    Fax?: Fax
    Gender?: Gender,
    DeleteCode?: DeleteCode,
    NationalityISO2?: NationalityISO2,
    NationalityISO3?: NationalityISO3,
    Language?: Language,
    VipCode?: VipCode,
    ProfileGlobalID?: ProfileGlobalID,
    CentralSyncTime?: CentralSyncTime,
    CreditStatus?: CreditStatus,
    CreditReason?: CreditReason,
    CreditStatusChangeTime?: CreditStatusChangeTime,
    LinkedProfile?: LinkedProfile,
    BirthPlace?: BirthPlace,
    Department?: Department,
    Position?: Position,
    ProfileExternalID?: ProfileExternalID,
    Guest3rdPartyID?: Guest3rdPartyID,
    ProfileAttribute?: ProfileAttribute,
    LastUpdateTime?: LastUpdateTime,
    CreationTime?: CreationTime,
    NoMailing?: NoMailing,
    NoEMailing?: NoEMailing,
    GuestComment?: GuestComment,
    IncludeNotCommited?: IncludeNotCommited,


    PersonalDocument?: PersonalDocument,
    Membership?: Membership,
    ProfilePreference?: ProfilePreference,
    ProfilePreferences?: ProfilePreferences,
    Notes?: INote[],
    NotesList?: any,
    Addresses?: any,
    Communication?: any,
    Communications?: any,
    CustomField?: any,
    TryToGlobalize?: 1,

}

export type IProfileFields = keyof IProfile


export interface IProfileInsertFields {
    GuestFirstname: GuestFirstname,
    GuestName?: GuestName,
    Name2?: string,
    LoginName?: string,
    LoginPassword?: string,
    CorporateID?: string,
    ProfileType: ProfileType,
    ProfileCategory: ProfileCategory,
    Title?: Title
    AddressGreeting?: AddressGreeting,
    LetterGreeting?: LetterGreeting,
    Birthday?: Birthday,
    City?: City,
    Street1?: Street1,
    Street2?: Street2,
    Street3?: Street3,
    ZIP?: ZIP,
    State?: State,
    CountryISO2?: CountryISO2,
    CountryISO3?: CountryISO3,
    Telephone?: Telephone,
    Email?: Email
    EMail?: Email
    MembershipType?: any
    Fax?: Fax
    Gender?: Gender,
    DeleteCode?: DeleteCode,
    NationalityISO2?: NationalityISO2,
    NationalityISO3?: NationalityISO3,
    Language?: Language,
    VipCode?: VipCode,
    ProfileGlobalID?: ProfileGlobalID,
    CentralSyncTime?: CentralSyncTime,
    CreditStatus?: CreditStatus,
    CreditReason?: CreditReason,
    CreditStatusChangeTime?: CreditStatusChangeTime,
    LinkedProfile?: LinkedProfile,
    BirthPlace?: BirthPlace,
    Department?: Department,
    Position?: Position,
    ProfileExternalID?: ProfileExternalID,
    Guest3rdPartyID?: Guest3rdPartyID,
    ProfileAttribute?: ProfileAttribute,
    LastUpdateTime?: LastUpdateTime,
    CreationTime?: CreationTime,
    NoMailing?: NoMailing,
    NoEMailing?: NoEMailing,
    GuestComment?: GuestComment,
    IncludeNotCommited?: IncludeNotCommited,


    PersonalDocument?: PersonalDocument,
    Membership?: Membership,
    ProfilePreference?: ProfilePreference,
    ProfilePreferences?: ProfilePreferences,
    Notes?: Note[],
    NotesList?: any,
    Addresses?: any,
    Communication?: any,
    Communications?: any,
    CustomField?: any,
    TryToGlobalize?: 1
    TryToMerge?: 1
}

export interface IProfileAndReservation {
    GuestFirstname: string,
    GuestName: string,
    Email: string,
    TryToMerge: 0 | 1,
    ProfileType: 1 | 2 | 3 ,
    RoomType: string,
    RateCode: string,
    NoOfAdults: number,
    GuestArrival: GuestArrival,
    GuestDeparture: GuestDeparture,
    CompanyID?: number,
    TravelAgentID?: number,
    NoOfRooms: number,
    CrsSystem?: string,
    CrsResNumber?: string,
    MarketCode: string,
    SourceCode: string,
    ChannelCode: string,
    Child: Child
}
