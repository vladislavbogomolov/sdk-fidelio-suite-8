import {IDeleteReservationOption} from "../../../interfaces/commamds";


export const deleteReservation = (GuestNum: number, options: IDeleteReservationOption = null) => {
    const {Reason, DeleteTraces, SendEmail} = options ?? {Reason: '', DeleteTraces: 0, SendEmail: 0}
    return {
        command: {
            cancel: {
                GuestNum,
                Reason,
                DeleteTraces,
                SendEmail,
            }
        }
    }
}
