import {FidelioRequest} from "./requests/FidelioRequest";
import {ReservationCondition} from "./requests/objects/reservation/ReservationCondition";
import {AvailabilityForWeb} from "./models/AvailabilityForWeb";
import {Reservation} from "./models/Reservation";
import {Package} from "./models/Package";
import {Profile} from "./models/Profile";
import {CustomQuery} from "./models/CustomQuery";

export {CustomQuery, Profile, Package, Reservation, AvailabilityForWeb, ReservationCondition, FidelioRequest}


async function test() {



    const result = await new CustomQuery().where('XCMS_NAME3', 'Rik').get('XCMS', ['XCMS_NAME3'])

    console.log(result)

}

test()
