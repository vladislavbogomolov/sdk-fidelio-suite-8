import {FidelioRequest} from "../requests/FidelioRequest";
import {IProfileConditionKeyFields} from "../interfaces/profile/IProfileConditionFields";
import {IOperation} from "../interfaces/types";
import {PackageCondition} from "../requests/objects/package/PackageCondition";

export class CustomQuery {
    private from: string;
    private fields: string[];
    private dataOrigin: any

    #conditions: PackageCondition = new PackageCondition()


    async get(from: string, fields: string[]) {
        this.fields = fields
        this.from = from
        const response = await new FidelioRequest().addCustomQueryRequest(this.#conditions, this.from, this.fields).send()
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
