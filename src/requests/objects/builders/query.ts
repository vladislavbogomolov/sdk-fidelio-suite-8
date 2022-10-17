import {Fields} from "./fields";
import {IProfileConditionList} from "../../../interfaces/profile/IProfileConditionFields";
import {Conditions} from "./conditions";
import {ReqType} from "../../../interfaces/types";
import {IReservationConditionList} from "../../../interfaces/reservation";
import {Froms} from "./froms";

export const Query = (conditions: IProfileConditionList[] | IReservationConditionList[], fields: any, reqType: ReqType, method: "insert" | "query" | "update" = 'query', from: string = null) => {

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
