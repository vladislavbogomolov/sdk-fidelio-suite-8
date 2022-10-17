import {IFieldsRequestAvailabilityForWeb} from "../interfaces/availability";
import {FidelioRequest} from "../requests/FidelioRequest";

export class AvailabilityForWeb {
    private fields: IFieldsRequestAvailabilityForWeb;
    private dataOrigin: any

    constructor(fields: IFieldsRequestAvailabilityForWeb = null) {
        this.fields = fields
    }

    async get() {
        const response = await new FidelioRequest().addAvailabilityRequest(this.fields).send()
        this.dataOrigin = response.data
        return this;
    }

    set set(availability: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(availability))
    }

    get data() {
        return this.dataOrigin
    }

    toJSON() {
        return this.dataOrigin
    }

}
