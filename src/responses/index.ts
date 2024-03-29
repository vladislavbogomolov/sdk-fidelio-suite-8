import {AxiosResponse} from "axios";
import xml2js from 'xml2js'
import {IFidelioResponse, QueryResponse, Row} from "../interfaces/response";
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

const fidelioToDateTime = (date: string): string => {

    if (!date) return null;

    if (date.indexOf(".000 UTC-60") > 0) {
        return dayjs(date.replace(".000 UTC-60", ""), "DD.MM.YYYY hh:mm:ss").toJSON()
    } else {
        return dayjs(date, "DD.MM.YYYY").toJSON()
    }
}

const fidelioToDate = (date: string): string => {

    if (!date) return null;

    if (date.indexOf(".000 UTC-60") > 0) {
        return dayjs(date.replace(".000 UTC-60", ""), "DD.MM.YYYY hh:mm:ss").format('YYYY-MM-DD')
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

context.OptionDate = (...input: any[]): any => {

    // console.log(input[0])
    // input[1].OptionDate[input[0].$.attr] = input[0]._ ?? ''
    return input[1]
};

context.Package = (...input: any[]): any => {
    // console.log(input[0]);
    if (!Array.isArray(input[1].PackageCode)) {
        input[1].PackageCode = [];
    }
    // delete(input[0].$.name);

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

const types = ['queryResponse', 'insertResponse', 'updateResponse'];
type responseType = 'queryResponse' | 'insertResponse' | 'updateResponse';

const handlerResponseFidelio: any = {
    queryResponse: (queryResponse: QueryResponse[]) => {

        if (!queryResponse) return [];

        const responses: any = [];

        queryResponse.forEach((rows) => {

            const requestsObject: any[] = [];

            if (typeof rows.rows[0] === "string" && rows.rows[0] === '') {

                if (rows.$.Name.toString() !== 'AvailabilityForWeb') {
                    return [];
                    // throw new NotFoundError("The requested resource could not be found.");
                }


            } else {
                rows.rows[0].row.forEach((row: any) => {
                    let object: any = {};

                    if (!row.fields[0].field) return null;

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
                        } else if (fieldsDateTimeType.includes(fieldName)) {
                            object[fieldName] = fidelioToDateTime(field._)
                        } else if (fieldsCommunication.includes(fieldName)) {
                            object = fidelioCommunications(field, object)
                        } else {
                            object[fieldName] = field._ ?? ''
                        }
                    })

                    requestsObject.push(object)
                })

            }
            responses.push(requestsObject);


        })

        return responses[1] ? responses : responses[0]
    },
    insertResponse: (insertResponse: QueryResponse[]) => {
        const responses: any = [];
        let object: any = {};
        insertResponse[0].rows.forEach((row: any) => {
            Object.keys(row).forEach((key: string) => {

                const fieldName = key;

                if (context[fieldName]) {
                    if (!object[fieldName]) object[fieldName] = [];
                    object = context[fieldName].apply(context, [row[key][0], object]);
                } else if (addressesFields.includes(fieldName)) {
                    object = normalizeAddresses(object, row[key][0])
                } else if (fieldsNumberType.includes(fieldName)) {
                    object[fieldName] = Number(row[key][0])
                } else if (fieldsDateType.includes(fieldName)) {
                    object[fieldName] = fidelioToDate(row[key][0])
                } else if (fieldsDateTimeType.includes(fieldName)) {
                    object[fieldName] = fidelioToDateTime(row[key][0])
                } else if (fieldsCommunication.includes(fieldName)) {
                    object = fidelioCommunications(row[key][0], object)
                } else {
                    object[fieldName] = row[key][0] ?? ''
                }

                responses.push({
                    [key]: row[key][0]
                });
            })
        })
        return object
    }
}
export const parseResponse = async (response: AxiosResponse) => {

    const responses: any = [];

    return xml2js.parseStringPromise(response.data).then((result: IFidelioResponse) => {

        if (result.fidelio.response[0].$.Status !== 'OK') {
            throw {
                status: result.fidelio.response[0].$.Status,
                message: result.fidelio.response[0].$.Message.replace(/(\r\n|\n|\r)/gm, " ").trim(),
            }
        }

        /*if (result.fidelio.response[0].updateResponse) {
            responses.push({
                result: "ok"
            })
            return [];
        }*/

        let requestsResponses: any = [];
        types.forEach((type: responseType) => {
            if (result.fidelio.response[0][type] && handlerResponseFidelio[type]) {
                requestsResponses = handlerResponseFidelio[type](result.fidelio.response[0][type])
            }
        })

        return requestsResponses;
    }).catch((err) => {
        // Failed
        // console.log('err')
        // console.log(err)
        return Promise.reject(err)
    });

}

