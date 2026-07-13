import {Fields} from "./fields";
import {IProfileConditionList} from "../../../interfaces/profile/IProfileConditionFields";
import {Conditions} from "./conditions";
import {IMethod, ReqType} from "../../../interfaces/types";
import {IReservationConditionList} from "../../../interfaces/reservation";
import {Froms} from "./froms";

export const Query = (conditions: IProfileConditionList[] | IReservationConditionList[] | null, fields: any, reqType: ReqType, method: IMethod = 'query', from: string | null = null) => {

    return {
        [method]: {
            $: {
                ReqType: reqType,
                Name: reqType
            },
            ...Conditions(conditions),
            ...Fields(fields),
            ...Froms(from),
        },
    };
}
