import {IFieldsRequestAvailabilityForWeb} from "../interfaces/availability";
import {AvailabilityForWeb} from "./objects/availability-for-web";
import {IProfileFields, IProfileUpdateFields} from "../interfaces/profile";
import {Query} from "./objects/builders/query";
import {axiosApiInstance} from "./client/client";
import {profileFields} from "./objects/profile/ProfileQueryFields";
import {reservationFields} from "./objects/reservation/ReservationQueryFields";
import {IReservationFields, IReservationInsert, IReservationUpdate} from "../interfaces/reservation/IReservationFields";
import {ReservationCondition} from "./objects/reservation/ReservationCondition";
import {ProfileCondition} from "./objects/profile/ProfileCondition";
import {PackageFields} from "./objects/package/PackageFields";
import {PackageCondition} from "./objects/package/PackageCondition";
import {IPackageFields} from "../interfaces/package";
import {IMethod, ReqType} from "../interfaces/types";
import {deleteReservation} from "./objects/commands/commands";
import {IDeleteReservationOption} from "../interfaces/commamds";
import xml2js from "xml2js";


const builder = new xml2js.Builder();

export class FidelioRequest {

    protected _requestObject: any[] = [];
    protected connection: string;

    setConnection (connection: string) {
        this.connection = connection;
        return this
    }

    // -------------------------------------------  AVAILABILITY  -------------------------------------------------------

    /**
     * Availability - Selection
     * @param fields
     */
    addAvailabilityRequest = (fields: IFieldsRequestAvailabilityForWeb) => {
        const request = AvailabilityForWeb(fields);
        return this.addRequest(request)
    }

    // -------------------------------------------  CUSTOM QUERY  -------------------------------------------------------

    /**
     * Get data from tables - Custom Query
     * @param conditions
     * @param from
     * @param fields
     */
    addCustomQueryRequest = (conditions: PackageCondition = null, from: string, fields: string[]) => {
        return this.addQuery(conditions?.conditions ?? null, fields, "CustomQuery", "query", from)
    }

    // --------------------------------------------  PACKAGES  ----------------------------------------------------------

    /**
     * Packages - Selection
     * @param conditions
     * @param fields
     */
    addPackageRequest = (conditions: PackageCondition = null, fields: IPackageFields[] = null) => {
        return this.addQuery(conditions?.conditions ?? null, fields ?? PackageFields, "Package")
    }

    // --------------------------------------------  PROFILE  -----------------------------------------------------------

    /**
     * Profile - Selection
     * @param conditions
     * @param fields
     */
    addProfileQueryRequest = (conditions: ProfileCondition, fields: IProfileFields[] = null) => {
        return this.addQuery(conditions.conditions, fields ?? profileFields, "Profile")
    }


    /**
     * Profile - Update
     * @param conditions
     * @param fields
     */
    addProfileUpdateRequest = (conditions: ProfileCondition, fields: IProfileUpdateFields) => {
        return this.addQuery(conditions.conditions, fields, "Profile", "update")
    }


    // ------------------------------------------  RESERVATION  ---------------------------------------------------------

    /**
     * Reservation - Selection
     * @param conditions
     * @param fields
     */
    addReservationQueryRequest = (conditions: ReservationCondition, fields: IReservationFields[] = null) => {
        return this.addQuery(conditions.conditions, fields ?? reservationFields, "Reservation")
    }


    /**
     * Reservation - Insert
     * @param fields
     */
    addReservationInsertRequest = (fields: IReservationInsert[]) => {
        return this.addQuery([], fields, "Reservation", "insert")
    }

    /**
     * Reservation - Update
     * @param conditions
     * @param fields
     */
    addReservationUpdateRequest = (conditions: ReservationCondition, fields: IReservationUpdate) => {
        return this.addQuery(conditions.conditions, fields, "Reservation", "update")
    }

    /**
     * Reservation - Delete
     * @param GuestNum
     * @param options
     */
    addReservationDelete = (GuestNum: number, options:IDeleteReservationOption = null) => {
        const request = deleteReservation(GuestNum, options)
        return this.addRequest(request)
    }


    // ----------------------------------------------  SYSTEM  ---------------------------------------------------------

    addQuery = (conditions: any, fields: any, reqType: ReqType, method: IMethod = "query", from: string = null) => {
        const request = Query(conditions ?? null, fields, reqType, method, from);
        return this.addRequest(request)
    }

    printInConsole = () => {
        console.log(this.getBody())
    }

    protected addRequest = (request: any) => {
        this._requestObject.push(request);
        return this
    }

    getBody = () => {


        const body: any = {
            fidelio: {
                $: {
                    Version: process.env.FIDELIO_VERSION,
                },
                request: [{
                    $: {
                        UserName: process.env.FIDELIO_USERNAME,
                        Password: process.env.FIDELIO_PASSWORD,
                        Vendor: process.env.FIDELIO_VENDOR
                    },
                }]

            }
        }

        this._requestObject.forEach((request: any) => {
            const key = Object.keys(request)[0];
            if (!body.fidelio.request[0][key]) body.fidelio.request[0][key] = [];
            body.fidelio.request[0][key].push(request[key])
        })


        return builder.buildObject(body);
    }



    send = () => {
        console.log('OK', this.connection);
        return axiosApiInstance.post(process.env.FIDELIO_PATH, this.getBody());
    };

}
