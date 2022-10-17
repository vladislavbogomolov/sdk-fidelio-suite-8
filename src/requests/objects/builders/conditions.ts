import {IConditionObject} from "../../../interfaces/Request";
import {IOperators} from "../../../interfaces/types";


interface IConditions {
    conditions: IConditionInsideLink
}

interface IConditionInsideLink {
    condition: IConditionObject
    link?: ILink
}


interface ILink {
    condition: IConditionInsideLink,
    $: {
        operator: IOperators
    }
}

interface ILinkObject {
    link: ILink
}

export const Conditions = (conditions: any): IConditions | any => {
    if (!conditions || conditions.length === 0) return null;
    const firstCondition = conditions.reverse().shift();
    const conditionsObject = conditions.reduce((previousValue: ILinkObject, currentValue: any) => {
        const obj: ILinkObject = createConditionLinkObject(currentValue);
        obj.link.condition.link = previousValue.link;
        return obj
    }, createConditionLinkObject(firstCondition));

    return {
        conditions: conditionsObject.link.condition
    }
}

const createConditionLinkObject = (value: any): ILinkObject => {
    return {
        link: {
            condition: {
                condition: {
                    _: value.value,
                    $: {
                        name: value.name,
                        operation: value.operation
                    }
                }
            },
            $: {
                operator: value.operator
            }
        }
    }
}
