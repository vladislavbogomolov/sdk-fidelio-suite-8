import {IPackage} from "./package";

export interface IFieldsRequestChildrenCategories {
    ChildrenCategoriesCode: string | number,
    ChildrenCategoriesName: string | number,
    ChildrenCategoriesFromAge: string | number
    ChildrenCategoriesToAge: string | number
}

export interface IFieldsResponseChildrenCategories extends IFieldsRequestChildrenCategories{
    WebOnly: number
}