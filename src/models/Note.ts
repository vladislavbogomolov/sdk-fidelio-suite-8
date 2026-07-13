import {INote} from "../interfaces/types";
import {PackageCondition} from "../requests/objects/package/PackageCondition";

export class Note {

    attributes: INote | null = null; // Data Fidelio
    original: INote | null = null; // Data Fidelio
    private conditions: PackageCondition = new PackageCondition()

    constructor(note: INote | null = null) {
        if (note) {
            this.original = Object.assign(Object.create(Object.getPrototypeOf(this)), {...note})
            this.attributes = Object.assign(Object.create(Object.getPrototypeOf(this)), {...note})
        }
    }

    get data() {
        return this.attributes
    }

    async save() {
        if (!this.attributes!.subject) {
            return Promise.reject('subject is empty')
        }
    }

    setText(text: string) {
        this.attributes!.value = text;
        return this
    }

    setAttr(attr: string) {
        this.attributes!.attr = attr;
        return this
    }

    where(name: any, value: number) {
        this.conditions.addAnd(name, value, "eq")
        return this
    }

    delete() {
        delete this.attributes!.addData
        this.attributes!.value = ''
        this.attributes!.Delete = 1
    }

    toJSON() {
        return this.attributes
    }
}
