import {FidelioRequest} from "../requests/FidelioRequest";
import {IProfileConditionKeyFields} from "../interfaces/profile/IProfileConditionFields";
import {IOperation} from "../interfaces/types";
import {PackageCondition} from "../requests/objects/package/PackageCondition";

export class CustomQuery extends FidelioRequest {
    private dataOrigin: any

    #conditions: PackageCondition = new PackageCondition()

    async get(from: string, fields: string[]) {
        const response = await this.addCustomQueryRequest(this.#conditions, from, fields).send()
        this.dataOrigin = response.data
        return this;
    }

    set set(fields: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(fields))
    }

    get data() {
        return this.dataOrigin
    }

    /**
     * Add condition
     * @param name
     * @param value
     * @param operation
     */

    where<T extends keyof IProfileConditionKeyFields, K extends IProfileConditionKeyFields>(name: string, value: K[T], operation: IOperation = 'eq'): CustomQuery {
        this.#conditions.addAnd(name, value, operation)
        return this
    }

}
