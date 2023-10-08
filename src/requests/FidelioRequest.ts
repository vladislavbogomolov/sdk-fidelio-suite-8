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
import {IConnection} from "../config/connections";
import {ChildrenCategoriesFields} from "./objects/ChildrenCategories";
import {IFieldsRequestChildrenCategories} from "../interfaces/ChildrenCategories";
import {IRateListFields} from "../interfaces/RateList";
import {RateList} from "./objects/RateList";
import {IProfileAndReservation} from "../interfaces/profile";
import {IProfile} from "../interfaces/profile/IProfileFields";


const builder = new xml2js.Builder();

export class FidelioRequest {

    protected _requestObject: any[] = [];
    protected connection: IConnection;

    setConnection(connection: IConnection) {
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

    // ----------------------------------------  ChildrenCategories  ---------------------------------------------------

    /**
     * Children Categories - Selection
     * @param conditions
     * @param fields
     */
    addChildrenCategoriesRequest = (conditions: any, fields: IFieldsRequestChildrenCategories[] = null) => {
        return this.addQuery(conditions?.conditions ?? null, fields ?? ChildrenCategoriesFields, "ChildrenCategories")
    }

    // ----------------------------------------  Children Categories  ---------------------------------------------------

    /**
     * Rate List - Selection
     * @param conditions
     * @param fields
     */
    addRateListRequest = (conditions: PackageCondition = null, fields: IRateListFields[] = null) => {
        return this.addQuery(conditions?.conditions ?? null, fields ?? RateList, "RateList")
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

    /**
     * Profile - Create
     * @param conditions
     * @param fields
     */
    addProfileCreateRequest = (fields: IProfile) => {
        return this.addQuery(null, fields, "Profile", "insert")
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
     * Profile And Reservation - Insert
     * @param fields
     */
    addProfileAndReservationInsertRequest = (fields: IProfileAndReservation) => {
        return this.addQuery(null, fields, "ProfileAndReservation", "insert")
    }


    /**
     * Reservation - Insert
     * @param fields
     */
    addReservationInsertRequest = (fields: IReservationInsert) => {
        return this.addQuery(null, fields, "Reservation", "insert")
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
    addReservationDelete = (GuestNum: number, options: IDeleteReservationOption = null) => {
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
                    Version: '1.1.0',
                },
                request: [{
                    $: {
                        UserName: this.connection.FIDELIO_USERNAME,
                        Password: this.connection.FIDELIO_PASSWORD,
                        Vendor: this.connection.FIDELIO_VENDOR
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
        try {
            return axiosApiInstance.post(this.connection.URL, this.getBody());
        } catch (e) {
            return Promise.reject(e)
        }
    };

}
