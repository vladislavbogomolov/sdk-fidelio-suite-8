import {FidelioRequest} from "../requests/FidelioRequest";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {INote, IOperation} from "../interfaces/types";
import {IDeleteReservationOption} from "../interfaces/commamds";
import {IProfile, IProfileFields, IProfileInsertFields} from "../interfaces/profile/IProfileFields";
import {IProfileConditionFields, IProfileUpdateFields} from "../interfaces/profile";
import {profileUpdateFields} from "../requests/objects/profile/ProfileQueryFields";
import {ProfileCondition} from "../requests/objects/profile/ProfileCondition";
import {Fidelio} from "../Fidelio";


export class Profile extends FidelioRequest {

    #attributes: IProfile = {} as IProfile; // Data Fidelio
    readonly #original: IProfile = null; // Data Fidelio
    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey = 'ProfileID'

    constructor(profile: IProfile = null) {
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

    async get(selectFields: IProfileFields[] = null): Promise<Profile[]> {
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

    async delete(ProfileID: number = null, options: IDeleteReservationOption = null) {
        return new FidelioRequest().addReservationDelete(ProfileID ?? this.#original[this.#privateKey], options = null).send();
    }


    /**
     * Update or create profile
     */

    async save(): Promise<Profile> {
        const fidelioRequest = new FidelioRequest();
        if (this.#attributes[this.#privateKey]) {
            const newData = {} as IProfileUpdateFields;
            for (const key in this.#attributes) {
                // @ts-ignore
                if (profileUpdateFields.includes(key) && (!this.#original || JSON.stringify(this.#attributes[key]) !== JSON.stringify(this.#original[key]))) {
                    // @ts-ignore
                    newData[key] = this.#attributes[key]
                }
            }

            // console.log('newData')
            // console.log(newData)

            // Nothing to update
            if (Object.keys(newData).length === 0) return this.find(this.#attributes[this.#privateKey])

            await this.addProfileUpdateRequest(new PackageCondition().add(this.#privateKey, this.#attributes[this.#privateKey]), newData).send()

            return this.find(this.#attributes[this.#privateKey])
        } else {
            // create
            console.log('gg')
        }
    }

    async create(profile: IProfileInsertFields) {
        const responseUpdate = await this.addProfileCreateRequest(profile).send();
        return new Fidelio(this.connection).Profile.find(responseUpdate.data.ProfileID)
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

    #hydrate(profile: IProfile): IProfile {
        profile = JSON.parse(JSON.stringify(profile));
        /*if (profile.Notes) {
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
        }*/

        return profile
    }


    /**
     * Add note to reservation
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
     * Remove note from reservation
     * @param noteID
     */

    deleteNote(noteID: number | number[] | 'ALL'): Profile {
        if (Number.isFinite(noteID)) {
            this.#attributes.Notes.filter(note => Number(note.noteID) === noteID).map((note) => {
                note.Delete = 1
                note.value = JSON.stringify(note.value)
                return note
            })
        } else if (Array.isArray(noteID)) {
            this.#attributes.Notes.filter(note => noteID.includes(Number(note.noteID))).map((note) => {
                note.Delete = 1
                note.value = JSON.stringify(note.value)
                return note
            })
        } else if (noteID === 'ALL') {
            this.#attributes.Notes.map((note) => {
                note.Delete = 1
                note.value = JSON.stringify(note.value)
                return note
            })
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
