import {IFieldsRequestAvailabilityForWeb} from "./availability";
import {IDataType, IOperation} from "./types";
import {IProfileConditionFields} from "./profile";

/*export interface IFidelioRequest {
    [index: number]: IFieldsRequestAvailabilityForWeb
}*/

export type IFidelioRequest = IFieldsRequestAvailabilityForWeb


export interface IFieldAttributes {
    name: string;
    attr?: string;
}

export interface IFieldSimple {
    $: IFieldAttributes;
    _: string | number;
}



export interface IConditionObjectAttributes {
    name: IProfileConditionFields;
    operation: IOperation;
    dataType: IDataType
}

export interface IConditionObject {
    $: IConditionObjectAttributes;
    _: string | number;
}
