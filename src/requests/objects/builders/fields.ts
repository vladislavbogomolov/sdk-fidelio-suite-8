import {IFieldsRequestAvailabilityForWeb} from "../../../interfaces/availability";
import {Field} from "./field";
import {IFieldSimple} from "../../../interfaces/Request";
import {IReservationFields} from "../../../interfaces/reservation/IReservationFields";

export const Fields = (fields: any) => {

    let object: IFieldSimple[] = [];


    if (Array.isArray(fields)) {

        fields.forEach((field) => {
            object.push(Field(field) as IFieldSimple);
        })

    } else {
        for (const key in fields) {
            if (fields[key]) {
                const field = Field(key, fields[key]);
                Array.isArray(field) ? object = object.concat(...field) : object.push(field);
            }
        }
    }

    return {
        fields: {
            field: object
        }
    }
}
