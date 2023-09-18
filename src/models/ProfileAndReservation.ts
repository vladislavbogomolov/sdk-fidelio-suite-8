import {FidelioRequest} from "../requests/FidelioRequest";
import {IProfileAndReservation} from "../interfaces/profile";



export class CreateProfileAndReservation extends FidelioRequest {
  constructor() {
    super();
  }

  async create(reservation: IProfileAndReservation) {
    const result = await this.addProfileAndReservationInsertRequest(reservation).send();
    return result.data;
  }
}