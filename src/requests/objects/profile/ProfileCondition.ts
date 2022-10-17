import {IOperation, IOperators} from "../../../interfaces/types";
import {IProfileConditionFields} from "../../../interfaces/profile";

export class ProfileCondition {
    public conditions: any[] = [];

    add<T extends keyof IProfileConditionFields, K extends IProfileConditionFields>(name: T, value: K[T], operation: IOperation = 'eq', operator: IOperators = 'AND') {
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

    addAnd<T extends keyof IProfileConditionFields, K extends IProfileConditionFields>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "AND")
    }

    addNot<T extends keyof IProfileConditionFields, K extends IProfileConditionFields>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "NOT")
    }

    addOr<T extends keyof IProfileConditionFields, K extends IProfileConditionFields>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "OR")
    }
}
