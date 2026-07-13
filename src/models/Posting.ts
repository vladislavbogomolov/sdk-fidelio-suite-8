import {FidelioRequest} from "../requests/FidelioRequest";
import {
    IPosting,
    IPostingConditionFields,
    IPostingConditionKeyFields,
    IPostingFields,
    IPostingInsertFields
} from "../interfaces/posting";
import {Condition} from "../requests/objects/Condition";
import {IOperation} from "../interfaces/types";

export class Posting extends FidelioRequest {

    #attributes: IPosting | null = null; // Data Fidelio
    #conditions = new Condition<IPostingConditionFields>()
    readonly #privateKey: IPostingConditionKeyFields = 'PostingID'

    constructor(posting: IPosting | null = null) {
        super();
        if (posting) {
            this.#attributes = JSON.parse(JSON.stringify(posting));
        }
    }

    /**
     * JSON.stringify get #attributes property by default
     */

    toJSON() {
        return this.#attributes
    }

    /**
     * Getter
     */

    get data(): IPosting {
        return this.#attributes as IPosting
    }

    set attributes(attributes: IPosting) {
        this.#attributes = Object.assign({}, attributes);
    }

    /**
     * @param PostingID
     * @param fields optional subset of fields to fetch (smaller payload)
     */

    async find(PostingID: number, fields: IPostingFields[] | null = null): Promise<Posting> {
        const condition = new Condition<IPostingConditionFields>().add(this.#privateKey, PostingID);
        const postings = await this.addPostingQueryRequest(condition.conditions, fields).send();
        const posting = postings.data[0] ?? postings.data
        const newClass = new Posting(posting).setConnection(this.connection)
        newClass.where(this.#privateKey, posting[this.#privateKey])
        return newClass
    }

    where<T extends keyof IPostingConditionFields, K extends IPostingConditionFields>(name: T, value: K[T], operation: IOperation = 'eq'): Posting {
        this.#conditions.addAnd(name, value, operation)
        return this
    }

    async create(posting: IPostingInsertFields) {
        try {
            await this.addPostingCreateRequest(posting).send();
            return true;
        } catch (e) {
            console.error(e)
            return false;
        }
    }

    /**
     * Send a request for getting a query
     */

    async get(selectFields: IPostingFields[] | null = null): Promise<Posting[]> {

        const res = await this.addPostingQueryRequest(this.#conditions.conditions, selectFields).send();

        const classes: Posting[] = []

        if (!res.data) return [];

        res.data.forEach((posting: any) => {
            const newClass = new Posting(posting)
            newClass.where(this.#privateKey, posting[this.#privateKey])
            newClass.setConnection(this.connection)
            classes.push(newClass)
        })

        return classes
    }
}
