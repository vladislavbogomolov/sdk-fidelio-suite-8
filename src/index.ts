import {Fidelio} from "./Fidelio";
import {IFieldsRequestAvailabilityForWeb} from "./interfaces/availability";
import {Connections} from "./config/connections";

const reqFields: IFieldsRequestAvailabilityForWeb = {
    GuestArrival: new Date('2024-06-01'),
    GuestDeparture: new Date('2024-06-03'),
    NoOfAdults: 2,
    MultipleRates: 1,
    AvailabilityLimit: 'BookingOnline',
    WebOnly: 1
}

const connection = new Fidelio(Connections[0]);
connection.AvailabilityForWeb.where(reqFields).get().then((response) => {
    console.log(JSON.stringify(response))
})

export {Fidelio}
