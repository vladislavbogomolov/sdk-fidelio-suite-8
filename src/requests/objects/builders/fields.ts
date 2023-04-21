import {Field} from "./field";
import {IFieldSimple} from "../../../interfaces/Request";

export const Fields = (fields: any) => {

    let object: IFieldSimple[] = [];




    if (Array.isArray(fields)) {

        fields.forEach((field) => {
            object.push(Field(field) as IFieldSimple);
        })

    } else {
        for (const key in fields) {
            // if (fields[key] !== undefined) {
                const field = Field(key, fields[key]);
                Array.isArray(field) ? object = object.concat(...field) : object.push(field);
            // }
        }
    }

    return {
        fields: {
            field: object
        }
    }
}
