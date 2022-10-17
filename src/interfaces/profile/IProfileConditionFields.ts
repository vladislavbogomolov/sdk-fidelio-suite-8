import {
    GuestFirstname,
    GuestName,
    IOperators,
    ProfileCategory,
    ProfileID,
    ProfileType,
    Name2,
    LoginName,
    ProfileGlobalID,
    LoginPassword,
    City,
    CentralSyncTime,
    ZIP,
    CorporateID,
    EMail,
    ProfileExternalID,
    Membership,
    MembershipType,
    Guest3rdPartyID,
    LastUpdateTime,
    CreationTime, IOperation
} from "../types";

export interface IProfileConditionFields {
    ProfileID?: ProfileID,
    GuestFirstname?: GuestFirstname,
    GuestName?: GuestName,
    Name2?: Name2,
    ProfileType?: ProfileType,
    ProfileCategory?: ProfileCategory,
    LoginName?: LoginName;
    LoginPassword?: LoginPassword;
    ProfileGlobalID?: ProfileGlobalID;
    CentralSyncTime?: CentralSyncTime;
    City?: City;
    ZIP?: ZIP;
    CorporateID?: CorporateID;
    EMail?: EMail;
    ProfileExternalID?: ProfileExternalID;
    Membership?: Membership;
    MembershipType?: MembershipType;
    Guest3rdPartyID?: Guest3rdPartyID;
    LastUpdateTime?: LastUpdateTime;
    CreationTime?: CreationTime;
}

export type IProfileConditionKeyFields = keyof IProfileConditionFields;


export interface IProfileConditionList {
    name: IProfileConditionKeyFields,
    operation: IOperation,
    value: string | number,
    operator: IOperators
}

