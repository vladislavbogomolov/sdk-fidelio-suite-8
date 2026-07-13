import {Field} from "./field";
import {IFieldSimple} from "../../../interfaces/Request";

export const Fields = (fields: any) => {

    let object: IFieldSimple[] = [];

    if (Array.isArray(fields)) {

        fields.forEach((field) => {
            object.push(Field(field) as IFieldSimple);
        })

    } else {
        for (const key of Object.keys(fields)) {
            const field = Field(key, fields[key]);
            if (Array.isArray(field)) {
                object = object.concat(...field);
            } else {
                object.push(field);
            }
        }
    }

    return {
        fields: {
            field: object
        }
    }
}
