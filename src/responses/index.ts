import {AxiosResponse} from "axios";
import xml2js from 'xml2js'
import {IFidelioResponse, QueryResponse, Row} from "../interfaces/response";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat)

const fieldsNumberType = [
    "ProfileID", "ProfileType", "ProfileCategory", "ProfileGlobalID", "ProfileExternalID", "DeleteCode",
    "NoOfAdults", "GuestNum", "ReservationState", "NoOfRooms", "NoAvailReason", "ReservationStatus", "CompanyID",
    "TravelAgentID", "SourceID", "GroupID", "BookerID", "PartyID", "RateValue", "ForeignRateValue", "TotalStay",
    "NoMailing", "NoEMailing", "BedReservation",
    "Price", "ForeignTotalStay", "NetRoomRevenue", "BaseCurrencyPrice", "PackagePrice", "Availability",
    "PackagePriceType", "PackageIncluded", "PackageSinglePerRes", "PackageShowInRes", "PackagePercentage",
    "PackageDisplOrder", "DepartmentCode"
]

const fieldsDateType = [
    "CheckinDateTime", "CheckoutDateTime", "Date", "PackageStart", "PackageEnd", "Birthday",
    "CentralSyncTime", "LastUpdateTime", "CreationTime", "GuestArrival", "GuestDeparture"
]

const fieldsCommunication = ["Email", "Fax", "Telephone", "Communication"]

const fidelioToDate = (date: string): string => {

    if (!date) return null;

    if (date.indexOf(".000 UTC-60") > 0) {
        return dayjs(date.replace(".000 UTC-60", ""), "DD.MM.YYYY hh:mm:ss").toJSON()
    } else {
        return dayjs(date, "DD.MM.YYYY").toJSON()
    }
}

const fidelioCommunications = (field: any, object: any): any => {
    if (field.$.attr) {
        if (!object.Communications) object.Communications = [];
        field.$.value = field._
        field.$.addData = Number(field.$.addData);
        field.$.CommType = Number(field.$.CommType);
        field.$.PhoneRole = Number(field.$.PhoneRole);
        field.$.Primary = Number(field.$.Primary);
        object.Communications.push(field.$)
    } else {
        object[field.$.name] = field._
    }
    return object
}

const context: any = {};

context.CustomField = (...input: any[]): any => {
    if (Array.isArray(input[1].CustomField)) {
        input[1].CustomField = {};
    }
    input[1].CustomField[input[0].$.attr] = input[0]._ ?? ''
    return input[1]
};


context.Membership = (...input: any[]): any => {
    input[1].Membership.push({...input[0].$, value: input[0]._})
    return input[1]
};

context.ProfilePreference = (...input: any[]): any => {
    input[1].ProfilePreference.push({...input[0].$, value: input[0]._})
    return input[1]
};

context.Notes = (...input: any[]): any => {
    if (!input[0].$.attr) return input[1]
    try {
        input[1].Notes.push({...input[0].$, value: JSON.parse(input[0]._)})
    } catch (e) {
        input[1].Notes.push({...input[0].$, value: input[0]._})
    }
    return input[1]
}

context.AccompanyingGuest = (...input: any[]): any => {
    input[1].AccompanyingGuest.push({...input[0].$, value: JSON.parse(input[0]._)})
    return input[1]
};

// Profile

context.PersonalDocument = (...input: any[]): any => {
    input[0].$.attr = Number(input[0].$.attr)
    input[0].$.CountryID = Number(input[0].$.CountryID)
    input[0].$.NationalityID = Number(input[0].$.NationalityID)
    input[0].$.IssuerCountryID = Number(input[0].$.NationalityID)
    input[0].$.IssuerStateID = Number(input[0].$.IssuerStateID)
    input[0].$.BornInID = Number(input[0].$.BornInID)
    input[0].$.BornStateID = Number(input[0].$.BornStateID)
    input[0].$.Primary = Number(input[0].$.Primary)
    input[1].PersonalDocument.push({...input[0].$, value: input[0]._})
    return input[1]
};

const addressesFields: string[] = ["Street1", "Street2", "Street3", "State", "City", "CountryISO2", "CountryISO3", "PrimaryAddr"];
const normalizeAddresses = (object: any, field: any) => {

    if (!field._ || !field.$.addData) return object;
    if (!object.Addresses) object.Addresses = []
    const isExistsID = object.Addresses.find((address: any) => address.addData === Number(field.$.addData));
    if (isExistsID) {
        object.Addresses.map((address: any) => {
            if (address.addData === Number(field.$.addData)) {
                address[field.$.name] = field._
            }
            return address
        })
    } else {
        const initObj: any = {
            attr: field.$.attr,
            addData: Number(field.$.addData),
            Street1: null,
            Street2: null,
            Street3: null,
            City: null,
            State: null,
            CountryISO2: null,
            CountryISO3: null,
            PrimaryAddr: null,
        }
        object.Addresses.push({...initObj, [field.$.name]: field._});
    }

    return object
}

export const parseResponse = async (response: AxiosResponse) => {

    const responses: any = [];

    return xml2js.parseStringPromise(response.data).then((result: IFidelioResponse) => {
        // Check errors
        if (result.fidelio.response[0].$.Status !== 'OK') {
            return Promise.reject(result.fidelio.response[0].$)
        }

        if (result.fidelio.response[0].updateResponse) {
            responses.push({
                result: "ok"
            })
            return
        }

        if (!result.fidelio.response[0].queryResponse[0].rows[0].row) return [];


        result.fidelio.response[0].queryResponse.forEach((rows: QueryResponse, requestIndex: number) => {
            // Single request
            // rows.$.Name // Profile | Reservation..

            const requestsObject: any[] = [];

            rows.rows[0].row.forEach((row: any) => {
                let object: any = {};

                row.fields[0].field.forEach((field: any) => {

                    const fieldName = field.$.name;

                    if (context[fieldName]) {
                        if (!object[fieldName]) object[fieldName] = [];
                        object = context[fieldName].apply(context, [field, object]);
                    } else if (addressesFields.includes(fieldName)) {
                        object = normalizeAddresses(object, field)
                    } else if (fieldsNumberType.includes(fieldName)) {
                        object[fieldName] = Number(field._)
                    } else if (fieldsDateType.includes(fieldName)) {
                        object[fieldName] = fidelioToDate(field._)
                    } else if (fieldsCommunication.includes(fieldName)) {
                        object = fidelioCommunications(field, object)
                    } else {
                        object[fieldName] = field._ ?? ''
                    }
                })

                requestsObject.push(object)
            })

            responses.push(requestsObject);
        })

        return responses[1] ? responses : responses[0]
    }).catch((err) => {
        // Failed
        console.log('err')
        console.log(err)
        return Promise.reject(err)
    });

}

