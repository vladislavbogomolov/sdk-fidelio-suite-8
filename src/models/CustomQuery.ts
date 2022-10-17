import {FidelioRequest} from "../requests/FidelioRequest";

export class CustomQuery {
    private from: string;
    private fields: string[];
    private dataOrigin: any



    async get(from: string, fields: string[]) {
        this.fields = fields
        this.from = from
        const response = await new FidelioRequest().addCustomQueryRequest(this.from, this.fields).send()
        this.dataOrigin = response.data
        return this;
    }

    set set(fields: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(fields))
    }

    get data() {
        return this.dataOrigin
    }

}
