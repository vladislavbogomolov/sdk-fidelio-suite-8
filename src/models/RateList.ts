import {FidelioRequest} from "../requests/FidelioRequest";
import {IRateListConditionFields, IRateListFields} from "../interfaces/RateList";
import {IProfileConditionKeyFields} from "../interfaces/profile/IProfileConditionFields";
import {IOperation} from "../interfaces/types";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {IProfile} from "../interfaces/profile/IProfileFields";

export class RateList extends FidelioRequest{
    private dataOrigin: any
    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey = 'RateCode'
    /*async get(fields: IRateListFields[] = null) {
        const response = await this.addRateListRequest(null, fields = null).send()
        this.dataOrigin = response.data
        return this;
    }*/

    async get() {
        const response = await this.addRateListRequest(this.#conditions).send();
        this.dataOrigin = response.data
        return this;
    }
    /**
     * Add condition
     * @param name
     * @param value
     * @param operation
     */

    where<T extends keyof IRateListConditionFields, K extends IRateListConditionFields>(name: T, value: K[T], operation: IOperation = 'eq'): RateList {
        this.#conditions.addAnd(name, value, operation)
        return this
    }

    set set(categories: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(categories))
    }

    get data() {
        return this.dataOrigin
    }

    toJSON(): IRateListFields[] {
        return this.dataOrigin
    }

}
