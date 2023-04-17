import {IFieldsRequestAvailabilityForWeb} from "../interfaces/availability";
import {FidelioRequest} from "../requests/FidelioRequest";

export class AvailabilityForWeb extends FidelioRequest{
    private fields: IFieldsRequestAvailabilityForWeb;
    private dataOrigin: any

    async get(fields: IFieldsRequestAvailabilityForWeb = null) {
        const response = await this.addAvailabilityRequest(fields).send()
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
