import {AxiosResponse} from "axios";
import xml2js from 'xml2js'
import {IFidelioResponse, QueryResponse} from "../interfaces/response";
import {FidelioError} from "../errors";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat)

const fieldsNumberType = [
    "ProfileID", "ProfileType", "ProfileCategory", "ProfileGlobalID", "BookerGlobalID", "ProfileExternalID", "DeleteCode",
    "NoOfAdults", "GuestNum", "ReservationState", "NoOfRooms", "NoAvailReason", "ReservationStatus", "CompanyID",
    "TravelAgentID", "SourceID", "GroupID", "BookerID", "PartyID", "RateValue", "ForeignRateValue", "TotalStay",
    "NoMailing", "NoEMailing", "BedReservation",
    "Price", "ForeignTotalStay", "NetRoomRevenue", "BaseCurrencyPrice", "PackagePrice", "Availability",
    "PackagePriceType", "PackageIncluded", "PackageSinglePerRes", "PackageShowInRes", "PackagePercentage",
    "PackageDisplOrder", "DepartmentCode", "HasShare", "ResStatusPriorCXL", "PostingID", "DepartmentType",
    "PostingQuantity", "PostingGuestNumOrig", "PostingProfileOrigID", "PostingPrice"
]

const fieldsDateTimeType = [
    "CheckinDateTime", "CheckoutDateTime",
    "CentralSyncTime", "LastUpdateTime", "CreationTime"
]

const fieldsDateType = [
    "Date", "PackageStart", "PackageEnd", "Birthday", "GuestArrival", "GuestDeparture"
]

const fieldsCommunication = ["Email", "Fax", "Telephone", "Communication"]

const fidelioToDateTime = (date: string): string | null => {

    if (!date) return null;

    if (date.indexOf(".000 UTC-60") > 0) {
        return dayjs(date.replace(".000 UTC-60", ""), "DD.MM.YYYY HH:mm:ss").toJSON()
    } else {
        return dayjs(date, "DD.MM.YYYY").toJSON()
    }
}

const fidelioToDate = (date: string): string | null => {

    if (!date) return null;

    if (date.indexOf(".000 UTC-60") > 0) {
        return dayjs(date.replace(".000 UTC-60", ""), "DD.MM.YYYY HH:mm:ss").format('YYYY-MM-DD')
    } else {
        return dayjs(date, "DD.MM.YYYY").format('YYYY-MM-DD')
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

// OptionDate is intentionally skipped: the handler keeps the raw field out of the result object.
context.OptionDate = (...input: any[]): any => {
    return input[1]
};

context.Package = (...input: any[]): any => {
    if (!Array.isArray(input[1].PackageCode)) {
        input[1].PackageCode = [];
    }

    input[1].PackageCode.push({
        'Price': Number(input[0]._),
        ...input[0].$
    });
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
    } catch {
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
    input[0].$.IssuerCountryID = Number(input[0].$.IssuerCountryID)
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

type responseType = 'queryResponse' | 'insertResponse' | 'updateResponse';
const types: responseType[] = ['queryResponse', 'insertResponse', 'updateResponse'];

const parseField = (object: any, fieldName: string, rawValue: any, field: any): any => {
    if (context[fieldName]) {
        if (!object[fieldName]) object[fieldName] = [];
        return context[fieldName].apply(context, [field, object]);
    } else if (addressesFields.includes(fieldName)) {
        return normalizeAddresses(object, field)
    } else if (fieldsNumberType.includes(fieldName)) {
        object[fieldName] = Number(rawValue)
    } else if (fieldsDateType.includes(fieldName)) {
        object[fieldName] = fidelioToDate(rawValue)
    } else if (fieldsDateTimeType.includes(fieldName)) {
        object[fieldName] = fidelioToDateTime(rawValue)
    } else if (fieldsCommunication.includes(fieldName)) {
        return fidelioCommunications(field, object)
    } else {
        object[fieldName] = rawValue ?? ''
    }
    return object
}

const handlerResponseFidelio: any = {
    queryResponse: (queryResponse: QueryResponse[]) => {

        if (!queryResponse) return [];

        const responses: any = [];

        queryResponse.forEach((rows) => {

            const requestsObject: any[] = [];

            if (typeof rows.rows[0] === "string" && rows.rows[0] === '') {

                if (rows.$!.Name.toString() !== 'AvailabilityForWeb') {
                    return [];
                }

            } else {
                rows.rows[0].row.forEach((row: any) => {
                    let object: any = {};

                    if (!row.fields[0].field) return null;

                    row.fields[0].field.forEach((field: any) => {
                        object = parseField(object, field.$.name, field._, field)
                    })

                    requestsObject.push(object)
                })

            }
            responses.push(requestsObject);

        })

        return responses[1] ? responses : responses[0]
    },
    insertResponse: (insertResponse: QueryResponse[]) => {
        let object: any = {};
        insertResponse[0].rows.forEach((row: any) => {
            Object.keys(row).forEach((key: string) => {
                object = parseField(object, key, row[key][0], row[key][0])
            })
        })
        return object
    }
}

export const parseResponse = async (response: AxiosResponse) => {

    return xml2js.parseStringPromise(response.data).then((result: IFidelioResponse) => {

        if (result.fidelio.response[0].$.Status !== 'OK') {
            throw new FidelioError(
                result.fidelio.response[0].$.Status,
                (result.fidelio.response[0].$.Message ?? '').replace(/(\r\n|\n|\r)/gm, " ").trim(),
            )
        }

        let requestsResponses: any = [];
        types.forEach((type: responseType) => {
            if (result.fidelio.response[0][type] && handlerResponseFidelio[type]) {
                requestsResponses = handlerResponseFidelio[type](result.fidelio.response[0][type])
            }
        })

        return requestsResponses;
    }).catch((err) => {
        return Promise.reject(err)
    });

}
