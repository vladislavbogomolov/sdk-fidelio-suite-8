import {IDataType, IOperation, IOperators} from "../../../interfaces/types";

export class PackageCondition{
    public conditions: any[] = [];

    add(name: any, value: any, operation: IOperation = 'eq' , operator: IOperators = 'AND', dataType: IDataType = 'String') {
        this.conditions.push({
            name,
            value,
            operation,
            operator,
            dataType
        })

        return this
    }

    get() {
        return this.conditions
    }

    addAnd(name: any, value: any, operation: IOperation = 'eq', dataType: IDataType = 'String') {
        return this.add(name, value, operation, "AND")
    }

    addNot(name: any, value: any, operation: IOperation = 'eq', dataType: IDataType = 'String') {
        return this.add(name, value, operation, "NOT")
    }

    addOr(name: any, value: any, operation: IOperation = 'eq', dataType: IDataType = 'String') {
        return this.add(name, value, operation, "OR")
    }
}
