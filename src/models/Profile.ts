import {FidelioRequest} from "../requests/FidelioRequest";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {INote, IOperation} from "../interfaces/types";
import {Note} from "./Note";
import {IDeleteReservationOption} from "../interfaces/commamds";
import {IProfile} from "../interfaces/profile/IProfileFields";
import {IProfileConditionFields, IProfileUpdateFields} from "../interfaces/profile";
import {profileFields} from "../requests/objects/profile/ProfileQueryFields";
import {IProfileConditionKeyFields} from "../interfaces/profile/IProfileConditionFields";
import {ProfileCondition} from "../requests/objects/profile/ProfileCondition";


export class Profile extends FidelioRequest{

    #attributes: IProfile = null; // Data Fidelio
    readonly #original: IProfile = null; // Data Fidelio
    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey: IProfileConditionKeyFields = 'ProfileID'

    constructor(profile: IProfile = null) {
        super();
        if (profile) {
            this.#original = this.#hydrate(profile);
            this.#attributes = this.#hydrate(profile);
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

    /**
     *
     * @param ProfileID
     */

    async find(ProfileID: number): Promise<Profile> {

        const profiles = await this.addProfileQueryRequest(new ProfileCondition().add(this.#privateKey, ProfileID)).send();
        const profile = profiles.data[0]
        const newClass = new Profile(profile)
        newClass.where(this.#privateKey, profile[this.#privateKey])

        return newClass
    }


    /**
     * Send a request for getting a query
     */

    async get(): Promise<Profile[]> {
        const res = await this.addProfileQueryRequest(this.#conditions).send();
        const classes: Profile[] = []

        res.data.forEach((profile: any) => {
            const newClass = new Profile(profile)
            newClass.where(this.#privateKey, profile[this.#privateKey])
            classes.push(newClass)
        })

        return classes
    }


    /**
     * Delete current object or by ProfileID
     * @param ProfileID
     * @param options
     */

    async delete(ProfileID: number = null, options: IDeleteReservationOption = null) {
        return new FidelioRequest().addReservationDelete(ProfileID ?? this.#original[this.#privateKey], options = null).send();
    }


    /**
     * Update or create profile
     */

    async save(): Promise<Profile> {
        const fidelioRequest = new FidelioRequest();
        if (this.#attributes[this.#privateKey]) {
            const newData: IProfileUpdateFields = {} as IProfileUpdateFields;
            for (const key in this.#attributes) {
                // @ts-ignore
                if (profileFields.includes(key) && JSON.stringify(this.#attributes[key]) !== JSON.stringify(this.#original[key])) {
                    // @ts-ignore
                    newData[key] = this.#attributes[key]
                }
            }

            // console.log('newData')
            // console.log(newData)

            // Nothing to update
            if (Object.keys(newData).length === 0) return this.find(this.#attributes[this.#privateKey])
            const responseUpdate = await fidelioRequest.addProfileUpdateRequest(new PackageCondition().add(this.#privateKey, this.#attributes[this.#privateKey]), newData).send()
            return this.find(this.#attributes[this.#privateKey])
        } else {
            // create
        }
    }


    /**
     * Add condition
     * @param name
     * @param value
     * @param operation
     */

    where<T extends keyof IProfileConditionFields, K extends IProfileConditionFields>(name: T, value: K[T], operation: IOperation = 'eq'): Profile {
        this.#conditions.addAnd(name, value, operation)
        return this
    }

    #hydrate(profile: IProfile): IProfile {
        profile = JSON.parse(JSON.stringify(profile));
        if (profile.Notes) {
            const notes = JSON.parse(JSON.stringify(profile.Notes))
            profile.Notes = [];

            notes.forEach((note: INote) => {
                note.subject = "Profile";
                const noteClass: Note = new Note(note);
                noteClass.where(this.#privateKey, profile[this.#privateKey])
                profile.Notes.push(noteClass)
            })
        } else {
            profile.Notes = [];
        }

        return profile
    }


    /**
     * Add note to reservation
     * @param note
     */

    addNote(note: INote) {
        note.subject = "Profile";
        const noteClass: Note = new Note(note);
        if (this.#original[this.#privateKey]) {
            noteClass.where(this.#privateKey, this.#original[this.#privateKey])
        }
        this.#attributes.Notes.push(noteClass)

        return this
    }


    /**
     * Remove note from reservation
     * @param noteID
     */

    deleteNote(noteID: number | number[] | 'ALL'): Profile {
        if (Number.isFinite(noteID)) {
            this.#attributes.Notes.filter(note => Number(note.original.noteID) === noteID).map((note) => note.delete())
        } else if (Array.isArray(noteID)) {
            this.#attributes.Notes.filter(note => noteID.includes(Number(note.original.noteID))).map((note) => note.delete())
        } else if (noteID === 'ALL') {
            this.#attributes.Notes.map((note) => note.delete())
        }

        return this
    }


    // TODO Communications

    /*addAddress() {}
    updateAddress() {}
    removeAddress() {}

    addPersonalDocument() {}
    updatePersonalDocument() {}
    removePersonalDocument() {}*/


}
