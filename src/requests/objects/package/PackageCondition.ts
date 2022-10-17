import {IOperation, IOperators} from "../../../interfaces/types";

export class PackageCondition{
    public conditions: any[] = [];

    add(name: any, value: any, operation: IOperation = 'eq' , operator: IOperators = 'AND') {
        this.conditions.push({
            name,
            value,
            operation,
            operator
        })

        return this
    }

    get() {
        return this.conditions
    }

    addAnd(name: any, value: any, operation: IOperation = 'eq') {
        return this.add(name, value, operation, "AND")
    }

    addNot(name: any, value: any, operation: IOperation = 'eq') {
        return this.add(name, value, operation, "NOT")
    }

    addOr(name: any, value: any, operation: IOperation = 'eq') {
        return this.add(name, value, operation, "OR")
    }
}
