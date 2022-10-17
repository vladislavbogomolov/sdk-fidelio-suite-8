import {FidelioRequest} from "../requests/FidelioRequest";
import {ReservationCondition} from "../requests/objects/reservation/ReservationCondition";
import {IReservation, IReservationUpdate, IReservationUpdateFields} from "../interfaces/reservation/IReservationFields";
import {reservationUpdateFields} from "../requests/objects/reservation/ReservationQueryFields";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {IReservationConditionFieldsX} from "../interfaces/reservation/IReservationConditionFields";
import {INote, IOperation} from "../interfaces/types";
import {Note} from "./Note";
import {IDeleteReservationOption} from "../interfaces/commamds";

export class Reservation {

    #attributes: IReservation = null; // Data Fidelio
    readonly #original: IReservation = null; // Data Fidelio
    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey = 'GuestNum'

    constructor(reservation: IReservation = null) {
        if (reservation) {
            this.#original = this.#hydrate(reservation);
            this.#attributes = this.#hydrate(reservation);
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


    /**
     * Get Reservation by GuestNum
     * @param GuestNum
     */

    async find(GuestNum: number): Promise<Reservation> {

        const reservations = await new FidelioRequest().addReservationQueryRequest(new ReservationCondition().add("GuestNum", GuestNum)).send();
        const reservation = reservations.data[0]
        const newClass = new Reservation(reservation)
        newClass.where(this.#privateKey, reservation.GuestNum)

        return newClass
    }


    /**
     * Send a request for getting a query
     */

    async get(): Promise<Reservation[]> {
        const res = await new FidelioRequest().addReservationQueryRequest(this.#conditions).send();
        const classes: Reservation[] = []

        res.data.forEach((reservation: any) => {
            const newClass = new Reservation(reservation)
            newClass.where(this.#privateKey, reservation.GuestNum)
            classes.push(newClass)
        })

        return classes
    }

    /**
     * Delete current object or by GuestNum
     * @param GuestNum
     * @param options
     */

    async delete(GuestNum: number = null, options: IDeleteReservationOption = null) {
        return new FidelioRequest().addReservationDelete(GuestNum ?? this.#original.GuestNum, options = null).send();
    }


    /**
     * Update or create reservation
     */

    async save(): Promise<Reservation> {
        const fidelioRequest = new FidelioRequest();
        if (this.#attributes.GuestNum) {
            const newData: IReservationUpdate = {} as IReservationUpdate;
            for (const key in this.#attributes) {
                // @ts-ignore
                if (reservationUpdateFields.includes(key) && JSON.stringify(this.#attributes[key]) !== JSON.stringify(this.#original[key])) {
                    // @ts-ignore
                    newData[key] = this.#attributes[key]
                }
            }

            // console.log('newData')
            // console.log(newData)

            // Nothing to update
            if (Object.keys(newData).length === 0) return this.find(this.#attributes.GuestNum)
            const responseUpdate = await fidelioRequest.addReservationUpdateRequest(new ReservationCondition().add("GuestNum", this.#attributes.GuestNum), newData).send()
            return this.find(this.#attributes.GuestNum)
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

    where<T extends keyof IReservationConditionFieldsX, K extends IReservationConditionFieldsX>(name: T, value: K[T], operation: IOperation = 'eq'): Reservation {
        this.#conditions.addAnd(name, value, operation)

        return this
    }

    #hydrate(reservation: IReservation): IReservation {
        reservation = JSON.parse(JSON.stringify(reservation));
        if (reservation.Notes) {
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
        }

        return reservation
    }

    /**
     * Add note to reservation
     * @param note
     */

    addNote(note: INote) {
        note.subject = "Reservation";
        const noteClass: Note = new Note(note);
        if (this.#original.GuestNum) {
            noteClass.where("GuestNum", this.#original.GuestNum)
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
            this.#attributes.Notes.filter(note => Number(note.original.noteID) === noteID).map((note) => note.delete())
        } else if (Array.isArray(noteID)) {
            this.#attributes.Notes.filter(note => noteID.includes(Number(note.original.noteID))).map((note) => note.delete())
        } else if (noteID === 'ALL') {
            this.#attributes.Notes.map((note) => note.delete())
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


}
