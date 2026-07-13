import {IDataType, IOperation, IOperators} from "../../../interfaces/types";
import {Condition} from "../Condition";

/**
 * Free-form condition builder that additionally stamps every condition
 * with a Fidelio dataType attribute (defaults to String).
 */
export class PackageCondition extends Condition<any> {

    add(name: any, value: any, operation: IOperation = 'eq', operator: IOperators = 'AND', dataType: IDataType = 'String') {
        this.conditions.push({
            name,
            value,
            operation,
            operator,
            dataType
        })

        return this
    }

    addAnd(name: any, value: any, operation: IOperation = 'eq', dataType: IDataType = 'String') {
        return this.add(name, value, operation, "AND", dataType)
    }

    addNot(name: any, value: any, operation: IOperation = 'eq', dataType: IDataType = 'String') {
        return this.add(name, value, operation, "NOT", dataType)
    }

    addOr(name: any, value: any, operation: IOperation = 'eq', dataType: IDataType = 'String') {
        return this.add(name, value, operation, "OR", dataType)
    }
}
