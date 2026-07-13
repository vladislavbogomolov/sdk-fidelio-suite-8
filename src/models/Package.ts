import {FidelioRequest} from "../requests/FidelioRequest";
import {IPackageCode, IPackageCondition, IPackageFields} from "../interfaces/package";
import {PackageCondition} from "../requests/objects/package/PackageCondition";
import {ReservationCondition} from "../requests/objects/reservation/ReservationCondition";
import {Reservation} from "./Reservation";

export class Package extends FidelioRequest {
    private fields: IPackageFields[] | null = null;
    private dataOrigin: any
    private conditions: PackageCondition = new PackageCondition()

    async get(fields: IPackageFields[] | null = null) {
        this.fields = fields
        const response = await this.addPackageRequest(this.conditions, this.fields).send()
        this.dataOrigin = response.data
        return this;
    }

    set set(fields: any[]) {
        this.dataOrigin = JSON.parse(JSON.stringify(fields))
    }

    get data() {
        return this.dataOrigin
    }

    where<T extends keyof IPackageCondition, K extends IPackageCondition>(name: T, value: K[T]) {
        this.conditions.addAnd(name, value, "eq")
        return this
    }

    async addPackageToReservation(GuestNum: number, PackageCode: IPackageCode) {
        const conditions = new ReservationCondition().add("GuestNum", GuestNum)
        const reservation = new Reservation({'GuestNum': GuestNum}).setConnection(this.connection);
        await reservation.addReservationUpdateRequest(conditions, {
            'PackageCode': [PackageCode]
        }).send()

        return Promise.resolve(true)
    }

    async removePackageFromReservation(GuestNum: number, PackageCode: string) {
        return this.addPackageToReservation(GuestNum, {
            attr: PackageCode,
            addData: "DELETE"
        })
    }

}
