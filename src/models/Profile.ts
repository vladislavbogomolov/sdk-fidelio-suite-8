import {FidelioRequest} from "../requests/FidelioRequest";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {INote, IOperation} from "../interfaces/types";
import {IDeleteReservationOption} from "../interfaces/commamds";
import {IProfile, IProfileFields, IProfileInsertFields} from "../interfaces/profile/IProfileFields";
import {IProfileConditionFields, IProfileUpdateFields} from "../interfaces/profile";
import {profileUpdateFields} from "../requests/objects/profile/ProfileQueryFields";
import {ProfileCondition} from "../requests/objects/profile/ProfileCondition";

export class Profile extends FidelioRequest {

    #attributes: IProfile = {} as IProfile; // Data Fidelio
    readonly #original: IProfile | null = null; // Data Fidelio
    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey = 'ProfileID'

    constructor(profile: IProfile | null = null) {
        super();
        if (profile) {
            const str = JSON.stringify(profile)
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

    get data(): IProfile {
        return this.#attributes
    }

    /**
     * Setter
     * @param attributes
     */

    set attributes(attributes: IProfile) {
        this.#attributes = Object.assign({}, attributes);
    }

    set(attributes: IProfile) {
        this.#attributes = Object.assign(this.#attributes, attributes);
        return this;
    }

    /**
     *
     * @param ProfileID
     */

    async find(ProfileID: number): Promise<Profile> {
        this._requestObject = [];
        const condition = new ProfileCondition().add(this.#privateKey, ProfileID);
        const profiles = await this.addProfileQueryRequest(condition).send();
        const profile = profiles.data[0] ?? profiles.data
        const newClass = new Profile(profile).setConnection(this.connection)
        newClass.where(this.#privateKey, profile[this.#privateKey])
        return newClass
    }

    /**
     * Send a request for getting a query
     */

    async get(selectFields: IProfileFields[] | null = null): Promise<Profile[]> {
        const res = await this.addProfileQueryRequest(this.#conditions, selectFields).send();
        const classes: Profile[] = []

        if (!res.data) return [];
        res.data.forEach((profile: any) => {
            const newClass = new Profile(profile)
            newClass.where(this.#privateKey, profile[this.#privateKey])
            newClass.setConnection(this.connection)
            classes.push(newClass)
        })

        return classes
    }

    /**
     * Delete current object or by ProfileID
     * @param ProfileID
     * @param options
     */

    async delete(ProfileID: number | null = null, options: IDeleteReservationOption | null = null) {
        return new FidelioRequest().setConnection(this.connection).addReservationDelete(ProfileID ?? (this.#original![this.#privateKey] as number), options).send();
    }

    /**
     * Update or create profile
     */

    async save(): Promise<Profile> {
        if (this.#attributes[this.#privateKey]) {
            const newData = {} as IProfileUpdateFields;
            for (const key of Object.keys(this.#attributes) as (keyof IProfile)[]) {
                if ((profileUpdateFields as readonly string[]).includes(key)
                    && (!this.#original || JSON.stringify(this.#attributes[key]) !== JSON.stringify(this.#original[key]))) {
                    (newData as any)[key] = this.#attributes[key]
                }
            }

            // Nothing to update
            if (Object.keys(newData).length === 0) return this.find(this.#attributes[this.#privateKey] as number)

            await this.addProfileUpdateRequest(new PackageCondition().add(this.#privateKey, this.#attributes[this.#privateKey]), newData).send()

            return this.find(this.#attributes[this.#privateKey] as number)
        } else {
            return this.create(this.#attributes as IProfileInsertFields)
        }
    }

    async create(profile: IProfileInsertFields) {
        const responseUpdate = await this.addProfileCreateRequest(profile).send();
        return this.find(responseUpdate.data.ProfileID)
    }

    /**
     * Add condition
     * @param name
     * @param value
     * @param operation
     */

    where<T extends keyof IProfileConditionFields, K extends IProfileConditionFields>(name: T, value: K[T], operation: IOperation = 'eq'): Profile {
        this.#conditions.addAnd(name, value, operation)
        if (name === this.#privateKey) this.set({ProfileID: Number(value)})
        return this
    }

    /**
     * Add note to profile
     * @param note
     */

    addNote(note: INote) {
        if (!this.#attributes.Notes) {
            this.#attributes.Notes = [];
        }
        this.#attributes.Notes.push(note)
        return this;
    }

    /**
     * Remove note from profile
     * @param noteID
     */

    deleteNote(noteID: number | number[] | 'ALL'): Profile {
        const notes = this.#attributes.Notes;
        if (!notes) return this;

        if (typeof noteID === 'number') {
            notes.filter(note => Number(note.noteID) === noteID).forEach((note) => {
                note.Delete = 1
                note.value = JSON.stringify(note.value)
            })
        } else if (Array.isArray(noteID)) {
            notes.filter(note => noteID.includes(Number(note.noteID))).forEach((note) => {
                note.Delete = 1
                note.value = JSON.stringify(note.value)
            })
        } else if (noteID === 'ALL') {
            notes.forEach((note) => {
                note.Delete = 1
                note.value = JSON.stringify(note.value)
            })
        }

        return this
    }

}
