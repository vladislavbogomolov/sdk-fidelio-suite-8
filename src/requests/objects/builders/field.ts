import dayjs from "dayjs";
import {IChild} from "../../../interfaces/availability";
import {IFieldSimple} from "../../../interfaces/Request";
import {Note} from "../../../models/Note";
import {AccompanyingGuests} from "../../../interfaces/types";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {IPackageCode} from "../../../interfaces/package";

dayjs.extend(customParseFormat)

const context: any = {};


context.GuestDeparture = (date: Date): any => {
    return FieldSimple('GuestDeparture', parseDate(date).format('DD.MM.YYYY'))
};
context.GuestArrival = (date: Date) => {
    return FieldSimple('GuestArrival', parseDate(date).format('DD.MM.YYYY'))
};

context.Child = (child: IChild): IFieldSimple[] => {

    const result: IFieldSimple[] = [];

    for (const key in child) {
        if (child[key]) {
            result.push({
                $: {
                    name: 'Child',
                    attr: key
                },
                _: child[key]
            })
        }
    }

    return result
};

context.CustomField = (customFields: any): any => {
    const result: IFieldSimple[] = [];
    for (const key in customFields) {
        if (customFields[key]) {
            result.push({
                $: {
                    name: 'CustomField',
                    attr: key
                },
                _: customFields[key]
            })
        }
    }

    return result
}

context.Notes = (Notes: any[]): any => {
    const result: IFieldSimple[] = [];


    Notes.forEach(note => {
        result.push({
            $: {...note, name: "Notes"},
            _: note.value
        })
    })

    return result
}

context.AccompanyingGuest = (AccompanyingGuest: AccompanyingGuests[]): any => {

    const result: IFieldSimple[] = [];
    AccompanyingGuest.filter(guest => (guest.action && guest.action === "to_create") || guest.addData === "DELETE")
        .forEach(guest => {
            result.push({
                $: {...guest, name: "AccompanyingGuest"},
                _: guest.value
            })
        })

    return result
}

context.PackageCode = (PackageCode: IPackageCode[]): any => {

    const result: IFieldSimple[] = [];

    PackageCode.forEach(packageCode => {
        result.push({
            $: {...packageCode, name: "PackageCode"},
            _: packageCode.attr
        })
    })

    return result
}

const FieldSimple = (field: string, value: string | number): IFieldSimple => {
    return value !== undefined ? {
        $: {
            name: field
        },
        _: value ?? ''
    } : {
        $: {
            name: field
        },
        _: ''
    }
}

export const Field = (field: string, value: any = null): IFieldSimple | IFieldSimple[] => {
    return value && context[field] ? context[field].apply(context, [value]) : FieldSimple(field, value)
}

const parseDate = (date: Date) => {
    return dayjs(date, "DD.MM.YYYY HH:mm:ss").isValid() ? dayjs(date, "DD.MM.YYYY HH:mm:ss") : dayjs(date);
}
