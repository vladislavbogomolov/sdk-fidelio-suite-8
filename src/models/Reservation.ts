import {FidelioRecord} from "./FidelioRecord";
import {ReservationCondition} from "../requests/objects/reservation/ReservationCondition";
import {
    IReservation,
    IReservationFields,
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

export class Reservation extends FidelioRecord<IReservation> {

    #conditions: PackageCondition = new PackageCondition()
    readonly #privateKey = 'GuestNum'

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

    async get(fields: IReservationFields[] | null = null): Promise<Reservation[]> {
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

        if (this._attributes.GuestNum || this.#conditions.conditions.length) {

            const conditions = this._attributes.GuestNum
                ? new ReservationCondition().add("GuestNum", this._attributes.GuestNum)
                : this.#conditions;

            const GuestNum = conditions.conditions[0].value as number;

            const newData = this.changedFields<IReservationUpdate>(reservationUpdateFields);

            // Nothing to update
            if (Object.keys(newData).length === 0) return this.find(this._attributes.GuestNum as number)

            await this.addReservationUpdateRequest(conditions, newData).send()

            return this.find(GuestNum)
        } else {
            const responseUpdate = await this.addReservationInsertRequest(this._attributes as IReservationInsert).send()
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

    async delete(GuestNum: number | null = null, options: IDeleteReservationOption | null = null) {
        const response = await this.addReservationDelete(GuestNum ?? this._original!.GuestNum!, options).send();
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

    addNote_old(note: INote) {
        note.subject = "Reservation";
        const noteClass: Note = new Note(note);
        if (this._attributes.GuestNum) {
            noteClass.where("GuestNum", this._attributes.GuestNum)
        }
        if (!this._attributes.Notes) {
            this._attributes.Notes = [];
        }
        this._attributes.Notes.push(noteClass)

        return this
    }

    /**
     * Add profile to reservation
     * @param ProfileID
     */

    addAccompanyingGuest(ProfileID: number): Reservation {
        if (!this._attributes.AccompanyingGuest) this._attributes.AccompanyingGuest = [];

        if (!this._attributes.AccompanyingGuest.find(guest => guest.value === ProfileID)) {
            this._attributes.AccompanyingGuest.push({
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
        if (!this._attributes.AccompanyingGuest) return this;

        this._attributes.AccompanyingGuest = this._attributes.AccompanyingGuest
            .filter(guest => !(guest.value === ProfileID && guest.action && guest.action === "to_create"))

        const toDelete = this._attributes.AccompanyingGuest.find(guest => guest.value === ProfileID)

        if (toDelete) {
            toDelete.addData = "DELETE"
        }

        return this
    }

    /**
     * Add package
     */

    addPackage(packageCode: IPackageCode) {
        if (!this._attributes.PackageCode) this._attributes.PackageCode = [];

        if (!this._attributes.PackageCode.find((pack) => pack.attr === packageCode.attr)) {
            this._attributes.PackageCode.push(packageCode)
        }

        return this;
    }

    removePackage(packageCode: IPackageCode) {

        if (!this._attributes.PackageCode) this._attributes.PackageCode = [];

        packageCode.addData = "DELETE"
        const attachedPackage = this._attributes.PackageCode.find((pack) => pack.attr === packageCode.attr)
        if (!attachedPackage) {
            this._attributes.PackageCode.push(packageCode)
        } else {
            attachedPackage.addData = "DELETE"
        }

        return this
    }

}
