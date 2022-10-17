import {FidelioRequest} from "./requests/FidelioRequest";
import {ReservationCondition} from "./requests/objects/reservation/ReservationCondition";
import {AvailabilityForWeb} from "./models/AvailabilityForWeb";
import {Reservation} from "./models/Reservation";
import {Package} from "./models/Package";
import {Profile} from "./models/Profile";




async function test() {


    const profile = await new Profile().find(477822)


    profile.data.Birthday = '27.06.1992'

    await profile.save()

    console.log(JSON.stringify(await new Profile().find(477822), null, 4))


    /*const reservation = await new Reservation().find(42447)
    console.log(reservation)*/

    /*const result = await new AvailabilityForWeb({
        GuestArrival: new Date('2023-06-01'),
        GuestDeparture: new Date('2023-06-05'),
        NoOfAdults: 1
    }).get()

    console.log(result.data[0])*/
}

test()
