import {IFieldsRequestAvailabilityForWeb, IFieldsResponseAvailabilityForWeb} from "../interfaces/availability";
import {FidelioRequest} from "../requests/FidelioRequest";

export class AvailabilityForWeb extends FidelioRequest {
    private dataOrigin: any

    async get() {
        const response = await this.send()
        this.dataOrigin = response.data
        return this;
    }

    where(fields: IFieldsRequestAvailabilityForWeb) {
        this.addAvailabilityRequest(fields)
        return this;
    }

    set set(availability: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(availability))
    }

    get data() {
        return this.dataOrigin
    }

    toJSON(): IFieldsResponseAvailabilityForWeb[] {
        return this.dataOrigin
    }

}
