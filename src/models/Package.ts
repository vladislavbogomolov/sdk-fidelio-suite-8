import {FidelioRequest} from "../requests/FidelioRequest";
import {IPackageCondition, IPackageConditionFields, IPackageFields} from "../interfaces/package";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {IOperation} from "../interfaces/types";

export class Package {
    private fields: IPackageFields[];
    private dataOrigin: any
    private conditions: PackageCondition = new PackageCondition()



    async get(fields: IPackageFields[] = null) {
        this.fields = fields
        const response = await new FidelioRequest().addPackageRequest(this.conditions, this.fields).send()
        this.dataOrigin = response.data
        return this;
    }

    set set(fields: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(fields))
    }

    get data() {
        return this.dataOrigin
    }

    where<T extends keyof IPackageCondition, K extends IPackageCondition>(name: T, value: K[T]) {
        this.conditions.addAnd(name, value, "eq")
        return this
    }

}
