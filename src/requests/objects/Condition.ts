import {IOperation, IOperators} from "../../interfaces/types";

export class Condition<IConditionFields> {

    public conditions: any[] = [];

    add<T extends keyof IConditionFields, K extends IConditionFields>(name: T, value: K[T], operation: IOperation = 'eq', operator: IOperators = 'AND') {
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

    addAnd<T extends keyof IConditionFields, K extends IConditionFields>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "AND")
    }

    addNot<T extends keyof IConditionFields, K extends IConditionFields>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "NOT")
    }

    addOr<T extends keyof IConditionFields, K extends IConditionFields>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "OR")
    }
}
