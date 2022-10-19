import {FidelioRequest} from "./requests/FidelioRequest";
import {ReservationCondition} from "./requests/objects/reservation/ReservationCondition";
import {AvailabilityForWeb} from "./models/AvailabilityForWeb";
import {Reservation} from "./models/Reservation";
import {Package} from "./models/Package";
import {Profile} from "./models/Profile";

module.exports = {Profile, Package, Reservation, AvailabilityForWeb}

/*
async function test() {


    const profile = await new Profile().find(477822)


    profile.data.Birthday = '27.06.1992'

    await profile.save()

    console.log(JSON.stringify(await new Profile().find(477822), null, 4))
}

test()
*/