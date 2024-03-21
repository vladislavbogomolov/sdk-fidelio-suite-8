import {FidelioRequest} from "../requests/FidelioRequest";
import {ReservationCondition} from "../requests/objects/reservation/ReservationCondition";
import {
    IReservation, IReservationFields,
    IReservationInsert,
    IReservationUpdate,
} from "../interfaces/reservation/IReservationFields";
import {reservationUpdateFields} from "../requests/objects/reservation/ReservationQueryFields";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {IReservationConditionFieldsX} from "../interfaces/reservation/IReservationConditionFields";
import {INote, IOperation} from "../interfaces/types";
import {IDeleteReservationOption} from "../interfaces/commamds";
import {IPackageCode} from "../interfaces/package";
import {Note} from "./Note";

export class Reservation extends FidelioRequest {

    #attributes: IReservation = {} as IReservation; // Data Fidelio
    readonly #original: IReservation = null; // Data Fidelio
    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey = 'GuestNum'

    constructor(reservation: IReservation = null) {
        super();
        if (reservation) {
            const str = JSON.stringify(reservation);
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

    get data(): IReservation {
        return this.#attributes
    }

    /**
     * Setter
     * @param attributes
     */

    set attributes(attributes: IReservation) {
        this.#attributes = Object.assign({}, attributes);
    }

    set(attributes: IReservation) {
        this.#attributes = Object.assign(this.#attributes, attributes);
        return this;
    }


    /**
     * Get Reservation by GuestNum
     * @param GuestNum
     */

    async find(GuestNum: number): Promise<Reservation> {
        this._requestObject = [];
        const condition = new ReservationCondition().add("GuestNum", GuestNum);
        const reservations = await this.addReservationQueryRequest(condition).send();
        const newClass = new Reservation(reservations.data[0]).setConnection(this.connection)
        newClass.where(this.#privateKey, reservations.data[0].GuestNum)
        return newClass
    }


    /**
     * Send a request for getting a query
     */

    async get(fields: IReservationFields[] = null): Promise<Reservation[]> {
        const res = await this.addReservationQueryRequest(this.#conditions, fields).send();
        const classes: Reservation[] = []

        if (!res.data) return [];

        res.data.forEach((reservation: any) => {
            const newClass = new Reservation(reservation)
            newClass.where(this.#privateKey, reservation.GuestNum)
            newClass.setConnection(this.connection)
            classes.push(newClass)
        })

        return classes
    }


    /**
     * Update or create reservation
     */

    async save(): Promise<Reservation> {


        if (this.#attributes.GuestNum || this.#conditions.conditions.length) {

            const conditions = this.#attributes.GuestNum ? new ReservationCondition().add("GuestNum", this.#attributes.GuestNum) : this.#conditions;

            const GuestNum = conditions.conditions[0].value

            const newData = {} as IReservationUpdate;
            for (const key in this.#attributes) {
                // @ts-ignore
                if (reservationUpdateFields.includes(key) && (!this.#original || JSON.stringify(this.#attributes[key]) !== JSON.stringify(this.#original[key]))) {
                    // @ts-ignore
                    newData[key] = this.#attributes[key]
                }
            }

            // Nothing to update
            if (Object.keys(newData).length === 0) return this.find(this.#attributes.GuestNum)

            await this.addReservationUpdateRequest(conditions, newData).send()

            return this.find(GuestNum)
        } else {
            const responseUpdate = await this.addReservationInsertRequest(this.#attributes as IReservationInsert).send()
            return this.find(responseUpdate.data.GuestNum)
        }
    }

    async create(reservation: IReservationInsert) {
        const responseUpdate = await this.addReservationInsertRequest(reservation).send();
        return this.find(responseUpdate.data.GuestNum)
    }

    /**
     * Delete current object or by GuestNum
     * @param GuestNum
     * @param options
     */

    async delete(GuestNum: number = null, options: IDeleteReservationOption = null) {
        const response = await this.addReservationDelete(GuestNum ?? this.#original.GuestNum, options = null).send();
        return response.data[0];
    }


    /**
     * Add condition
     * @param name
     * @param value
     * @param operation
     */

    where<T extends keyof IReservationConditionFieldsX, K extends IReservationConditionFieldsX>(name: T, value: K[T], operation: IOperation = 'eq'): Reservation {
        this.#conditions.addAnd(name, value, operation)
        if (name === this.#privateKey) this.set({GuestNum: Number(value)})

        return this
    }

    #hydrate(reservation: IReservation): IReservation {
        reservation = JSON.parse(JSON.stringify(reservation));
        /*if (reservation.Notes) {
            const notes = JSON.parse(JSON.stringify(reservation.Notes))
            reservation.Notes = [];

            notes.forEach((note: INote) => {
                note.subject = "Reservation";
                const noteClass: Note = new Note(note);
                noteClass.where("GuestNum", reservation.GuestNum)
                reservation.Notes.push(noteClass)
            })
        } else {
            reservation.Notes = [];
        }*/

        return reservation
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


    addNote_old(note: INote) {
        note.subject = "Reservation";
        const noteClass: Note = new Note(note);
        if (this.#attributes.GuestNum) {
            noteClass.where("GuestNum", this.#attributes.GuestNum)
        }
        if (!this.#attributes.Notes) {
            this.#attributes.Notes = [];
        }
        this.#attributes.Notes.push(noteClass)

        return this
    }


    /**
     * Remove note from reservation
     * @param noteID
     */

    deleteNote(noteID: number | number[] | 'ALL'): Reservation {
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
    /**
     * Add profile to reservation
     * @param ProfileID
     */

    addAccompanyingGuest(ProfileID: number): Reservation {
        if (!this.#attributes.AccompanyingGuest.find(guest => guest.value === ProfileID)) {
            this.#attributes.AccompanyingGuest.push({
                name: 'AccompanyingGuest',
                value: ProfileID,
                action: "to_create"
            })
        }

        return this
    }


    /**
     * Remove profile from reservation
     * @param ProfileID
     */

    deleteAccompanyingGuest(ProfileID: number): Reservation {
        this.#attributes.AccompanyingGuest = this.#attributes.AccompanyingGuest
            .filter(guest => !(guest.value === ProfileID && guest.action && guest.action === "to_create"))

        const toDelete = this.#attributes.AccompanyingGuest.find(guest => guest.value === ProfileID)

        if (toDelete) {
            toDelete.addData = "DELETE"
        }

        return this
    }


    /**
     * Add package
     */

    addPackage(packageCode: IPackageCode) {

        if (!this.#attributes.PackageCode.find((pack) => pack.attr === packageCode.attr)) {
            this.#attributes.PackageCode.push(packageCode)
        }

        return this;
    }


    removePackage(packageCode: IPackageCode) {

        if (!this.#attributes.PackageCode) this.#attributes.PackageCode = [];

        packageCode.addData = "DELETE"
        const attachedPackage = this.#attributes.PackageCode.find((pack) => pack.attr === packageCode.attr)
        if (!attachedPackage) {
            this.#attributes.PackageCode.push(packageCode)
        } else {
            attachedPackage.addData = "DELETE"
        }

        return this
    }


}
