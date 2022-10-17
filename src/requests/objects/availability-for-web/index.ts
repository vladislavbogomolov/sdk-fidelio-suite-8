import {IFieldsRequestAvailabilityForWeb} from "../../../interfaces/availability";
import {Fields} from "../builders/fields";

export const AvailabilityForWeb = (fields: IFieldsRequestAvailabilityForWeb) => {
    return {
        AvailabilityForWeb: {
            $: {
                Name: "AvailabilityForWeb"
            },
            ...Fields(fields)
        }
    };
}
