import {INote, IOperation} from "../interfaces/types";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {FidelioRequest} from "../requests/FidelioRequest";

export class Note {

    attributes: INote = null; // Data Fidelio
    original: INote = null; // Data Fidelio
    private conditions: PackageCondition = new PackageCondition()

    constructor(note: INote = null) {
        if (note) {
            this.original = Object.assign(Object.create(Object.getPrototypeOf(this)), {...note})
            this.attributes = Object.assign(Object.create(Object.getPrototypeOf(this)), {...note})
        }
    }

    get data() {
        return this.attributes
    }


    /*set data(note: INote) {
        this.attributes = Object.assign(Object.create(Object.getPrototypeOf(note)), JSON.parse(JSON.stringify(note)));
        this.original = Object.assign(Object.create(Object.getPrototypeOf(note)), JSON.parse(JSON.stringify(note)));
    }*/

    async save() {
        if (!this.attributes.subject) {
            return Promise.reject('subject is empty')
        }

        // const request = Query(conditions.conditions, fields, "Reservation", "update");
        // this.addRequest(request)

        /*const x =  new FidelioRequest().addQuery(this.conditions.conditions, {
            Notes: [this.attributes]
        }, this.original.subject, "update").getBody()

        console.log()*/

    }

    setText (text: string | number) {
        this.attributes.value = text;
        return this
    }

    setAttr(attr: string) {
        this.attributes.attr = attr;
        return this
    }

    where(name: "GuestNum" | "ProfileID" | "PostingID", value: number) {
        this.conditions.addAnd(name, value, "eq")
        return this
    }

    delete() {
        delete this.attributes.addData
         this.attributes.value = ''
        // delete this.attributes.attr
        this.attributes.Delete = 1
    }

    toJSON() {
        return this.attributes
    }
}
