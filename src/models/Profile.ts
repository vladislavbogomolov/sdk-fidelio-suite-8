import {FidelioRecord} from "./FidelioRecord";
import {FidelioRequest} from "../requests/FidelioRequest";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {IOperation} from "../interfaces/types";
import {IDeleteReservationOption} from "../interfaces/commamds";
import {IProfile, IProfileFields, IProfileInsertFields} from "../interfaces/profile/IProfileFields";
import {IProfileConditionFields, IProfileUpdateFields} from "../interfaces/profile";
import {profileUpdateFields} from "../requests/objects/profile/ProfileQueryFields";
import {ProfileCondition} from "../requests/objects/profile/ProfileCondition";

export class Profile extends FidelioRecord<IProfile> {

    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey = 'ProfileID'

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
        return new FidelioRequest().setConnection(this.connection).addReservationDelete(ProfileID ?? (this._original![this.#privateKey] as number), options).send();
    }

    /**
     * Update or create profile
     */

    async save(): Promise<Profile> {
        if (this._attributes[this.#privateKey]) {
            const newData = this.changedFields<IProfileUpdateFields>(profileUpdateFields);

            // Nothing to update
            if (Object.keys(newData).length === 0) return this.find(this._attributes[this.#privateKey] as number)

            await this.addProfileUpdateRequest(new PackageCondition().add(this.#privateKey, this._attributes[this.#privateKey]), newData).send()

            return this.find(this._attributes[this.#privateKey] as number)
        } else {
            return this.create(this._attributes as IProfileInsertFields)
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

}
