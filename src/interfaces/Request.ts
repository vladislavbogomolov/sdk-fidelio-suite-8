import {IFieldsRequestAvailabilityForWeb} from "./availability";
import {IOperation} from "./types";
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
}

export interface IConditionObject {
    $: IConditionObjectAttributes;
    _: string | number;
}
