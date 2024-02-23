import {IDeleteReservationOption} from "../../../interfaces/commamds";
import {IPosting, IPostingInsertFields} from "../../../interfaces/posting";


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

export const createPosting = (posting: IPostingInsertFields) => {

    return {
        command: {
            post: {
                crm_posting: posting
            }
        }
    }
}