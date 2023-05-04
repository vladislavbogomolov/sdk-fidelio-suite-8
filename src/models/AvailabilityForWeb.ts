import {IFieldsRequestAvailabilityForWeb, IFieldsResponseAvailabilityForWeb} from "../interfaces/availability";
import {FidelioRequest} from "../requests/FidelioRequest";
import {AxiosResponse} from "axios";

export class AvailabilityForWeb extends FidelioRequest{
    private fields: IFieldsRequestAvailabilityForWeb;
    private dataOrigin: any

    async get() {
        const response = await this.send()
        this.dataOrigin = response.data
        return this;
    }

    where(fields: IFieldsRequestAvailabilityForWeb = null) {
        const response = this.addAvailabilityRequest(fields)
        this.dataOrigin = response.data
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
