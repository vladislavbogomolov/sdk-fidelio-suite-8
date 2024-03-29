import {FidelioRequest} from "../requests/FidelioRequest";
import {IFieldsRequestChildrenCategories, IFieldsResponseChildrenCategories} from "../interfaces/ChildrenCategories";

export class ChildrenCategories extends FidelioRequest{
    private dataOrigin: any

    async get(fields: IFieldsRequestChildrenCategories[] = null) {
        const response = await this.addChildrenCategoriesRequest(null, fields = null).send()
        response.data.map( (row: IFieldsRequestChildrenCategories) => {
            row.ChildrenCategoriesFromAge = Number(row.ChildrenCategoriesFromAge)
            row.ChildrenCategoriesToAge = Number(row.ChildrenCategoriesToAge)
            return row;
        })
        this.dataOrigin = response.data
        return this;
    }

    set set(categories: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(categories))
    }

    get data() {
        return this.dataOrigin
    }

    toJSON(): IFieldsResponseChildrenCategories[] {
        return this.dataOrigin
    }

}
