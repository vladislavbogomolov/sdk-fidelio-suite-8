import { IDeleteReservationOption } from "../interfaces/commamds";
import { IProfileConditionKeyFields } from "../interfaces/profile/IProfileConditionFields";
import {IProfile} from "../interfaces/profile/IProfileFields";
import {INote, IOperation } from "../interfaces/types";


declare class Profile {


    constructor(profile?: IProfile );


    /**
     * JSON.stringify get #attributes property by default
     */

    toJSON(): IProfile
    /**
     * Getter
     */

    data(): IProfile


    /**
     * Setter
     * @param attributes
     */

    attributes(attributes: IProfile): void

    /**
     *
     * @param ProfileID
     */

    find(ProfileID: number): Promise<Profile>


    /**
     * Send a request for getting a query
     */

    get(): Promise<Profile[]>


    /**
     * Delete current object or by ProfileID
     * @param ProfileID
     * @param options
     */

    delete(ProfileID?: number, options?: IDeleteReservationOption)


    /**
     * Update or create profile
     */

    save(): Promise<Profile>


    /**
     * Add condition
     * @param name
     * @param value
     * @param operation
     */

    where<T extends keyof IProfileConditionKeyFields, K extends IProfileConditionKeyFields>(name: string, value: K[T], operation?: IOperation): Profile



    /**
     * Add note to reservation
     * @param note
     */

    addNote(note: INote): Profile


    /**
     * Remove note from reservation
     * @param noteID
     */

    deleteNote(noteID: number | number[] | 'ALL'): Profile


    // TODO Communications

    /*addAddress() {}
    updateAddress() {}
    removeAddress() {}

    addPersonalDocument() {}
    updatePersonalDocument() {}
    removePersonalDocument() {}*/


}
