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
import {Fidelio} from "../Fidelio";

export class Posting extends FidelioRequest {

    #attributes: IPosting = null; // Data Fidelio
    readonly #original: IPosting = null; // Data Fidelio
    #conditions = new Condition<IPostingConditionFields>()
    readonly #privateKey: IPostingConditionKeyFields = 'PostingID'

    constructor(posting: IPosting = null) {
        super();
        if (posting) {
            const str = JSON.stringify(posting)
            this.#original = JSON.parse(str);
            this.#attributes = JSON.parse(str);
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
        return this.#attributes
    }

    set attributes(attributes: IPosting) {
        this.#attributes = Object.assign({}, attributes);
    }

    /**
     * @param PostingID
     */

    async find(PostingID: number): Promise<Posting> {
        const condition = new Condition<IPostingConditionFields>().add(this.#privateKey, PostingID);
        const postings = await this.addPostingQueryRequest(condition.conditions).send();
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

    async get(selectFields: IPostingFields[] = null): Promise<Posting[]> {

        const res = await this.addPostingQueryRequest(this.#conditions.conditions, selectFields).send();

        const classes: Posting[] = []

        if (!res.data) return [];

        res.data.forEach((posting: any) => {
            const newClass = new Posting(posting)
            newClass.where(this.#privateKey, posting[this.#privateKey])
            classes.push(newClass)
        })

        return classes
    }
}