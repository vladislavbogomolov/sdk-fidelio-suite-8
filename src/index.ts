import {Fidelio} from "./Fidelio";

const FidelioClient = new Fidelio({

});


FidelioClient.Reservation.where('GuestNum', 1).set({
    BookerID: 1,
    ProfileID: 1,
    ReservationStatus: 1
}).save().then()

export {Fidelio}
