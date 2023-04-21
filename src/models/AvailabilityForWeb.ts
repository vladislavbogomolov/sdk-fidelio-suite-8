import {IFieldsRequestAvailabilityForWeb, IFieldsResponseAvailabilityForWeb} from "../interfaces/availability";
import {FidelioRequest} from "../requests/FidelioRequest";

export class AvailabilityForWeb extends FidelioRequest{
    private fields: IFieldsRequestAvailabilityForWeb;
    private dataOrigin: any

    get() {
        return this.send();
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
