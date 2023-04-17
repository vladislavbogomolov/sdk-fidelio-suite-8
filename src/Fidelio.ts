import { AvailabilityForWeb } from "./models/AvailabilityForWeb";
import { Profile } from "./models/Profile";
import { Reservation } from "./models/Reservation";
import { FidelioRequest } from "./requests/FidelioRequest";
import {IConnection} from "./config/connections";

export class Fidelio{
    public AvailabilityForWeb = new AvailabilityForWeb();
    public Profile = new Profile();
    public Reservation = new Reservation();
    readonly connection: IConnection;
    constructor(connection: IConnection) {
        this.connection = connection;
        this.AvailabilityForWeb.setConnection(this.connection);
        this.Profile.setConnection(this.connection);
        this.Reservation.setConnection(this.connection);
    }
}