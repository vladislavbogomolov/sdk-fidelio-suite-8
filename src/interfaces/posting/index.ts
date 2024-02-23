import {
    ProfileID,
    GuestNum,
    PostingID,
    LastUpdateTime,
    CreationTime,
    DepartmentCode,
    DepartmentType,
    PostingPrice,
    PostingQuantity,
    PostingDescription,
    PostingDate, IOperation, IOperators,
} from "../types"

export interface IPosting {
    PostingID: PostingID,
    GuestNum: GuestNum,
    ProfileID: ProfileID,
    Comment: string,
    Description: string,
    Quantity: number,
    DepartmentCode: DepartmentCode,
    DepartmentType: DepartmentType,
    PostingPrice: PostingPrice,
    PostingQuantity: PostingQuantity,
    PostingDescription: PostingDescription,
    PostingDate: PostingDate,
    PostingProfileOrigID: ProfileID,
    PostingGuestNumOrig: GuestNum,
    PostingComment: string,
    PostingCheckNr: number,
    LastUpdateTime?: LastUpdateTime,
    CreationTime?: CreationTime,

}

export type IPostingFields = keyof IPosting


export interface IPostingConditionFields {
    PostingID?: PostingID,
    GuestNum?: GuestNum,
    ProfileID?: ProfileID,
}

export type IPostingConditionKeyFields = keyof IPostingConditionFields;

export interface IPostingInsertFields {
    GuestNum?: GuestNum,
    ProfileID?: ProfileID,
    DepartmentCode: DepartmentCode,
    DepartmentType: DepartmentType,
    Price: PostingPrice,
    Quantity: PostingQuantity,
    Description?: PostingDescription,
    Comment?: string,
}

export interface IPostingConditionList {
    name: IPostingConditionFields,
    operation: IOperation,
    value: string | number,
    operator: IOperators
}