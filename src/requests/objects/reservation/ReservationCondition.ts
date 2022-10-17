import {IOperation, IOperators} from "../../../interfaces/types";
import {IReservationConditionFieldsX} from "../../../interfaces/reservation/IReservationConditionFields";


export class ReservationCondition {
    public conditions: any[] = [];

    add<T extends keyof IReservationConditionFieldsX, K extends IReservationConditionFieldsX>(name: T, value: K[T], operation: IOperation = 'eq', operator: IOperators = 'AND') {
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

    addAnd<T extends keyof IReservationConditionFieldsX, K extends IReservationConditionFieldsX>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "AND")
    }

    addNot<T extends keyof IReservationConditionFieldsX, K extends IReservationConditionFieldsX>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "NOT")
    }

    addOr<T extends keyof IReservationConditionFieldsX, K extends IReservationConditionFieldsX>(name: T, value: K[T], operation: IOperation = 'eq') {
        return this.add(name, value, operation, "OR")
    }



}
