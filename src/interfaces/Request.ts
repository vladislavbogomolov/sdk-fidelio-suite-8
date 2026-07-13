import {IDataType, IOperation} from "./types";

export interface IFieldAttributes {
    name: string;
    attr?: string;
}

export interface IFieldSimple {
    $: IFieldAttributes;
    _: string | number;
}

export interface IConditionObjectAttributes {
    name: string;
    operation: IOperation;
    dataType?: IDataType
}

export interface IConditionObject {
    $: IConditionObjectAttributes;
    _: string | number;
}
