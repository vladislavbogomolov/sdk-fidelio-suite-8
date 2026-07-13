export {Fidelio} from "./Fidelio";
export {FidelioRequest} from "./requests/FidelioRequest";
export {FidelioRecord} from "./models/FidelioRecord";
export {FidelioError} from "./errors";

export {Reservation} from "./models/Reservation";
export {Profile} from "./models/Profile";
export {Note} from "./models/Note";
export {Posting} from "./models/Posting";
export {Package} from "./models/Package";
export {CustomQuery} from "./models/CustomQuery";
export {RateList} from "./models/RateList";
export {AvailabilityForWeb} from "./models/AvailabilityForWeb";
export {ChildrenCategories} from "./models/ChildrenCategories";
export {CreateProfileAndReservation} from "./models/ProfileAndReservation";

export {Condition} from "./requests/objects/Condition";
export {PackageCondition} from "./requests/objects/package/PackageCondition";
export {ProfileCondition} from "./requests/objects/profile/ProfileCondition";
export {ReservationCondition} from "./requests/objects/reservation/ReservationCondition";

export type {IConnection} from "./config/connections";
export type {
    IReservation,
    IReservationFields,
    IReservationInsert,
    IReservationInsertFields,
    IReservationUpdate,
    IReservationUpdateFields,
} from "./interfaces/reservation/IReservationFields";
export type {
    IReservationConditionFieldsX,
    IReservationConditionFields,
} from "./interfaces/reservation/IReservationConditionFields";
export type {
    IProfile,
    IProfileFields,
    IProfileInsertFields,
    IProfileAndReservation,
} from "./interfaces/profile/IProfileFields";
export type {IProfileConditionFields, IProfileUpdateFields} from "./interfaces/profile";
export type {IPackage, IPackageFields, IPackageCondition, IPackageCode} from "./interfaces/package";
export type {
    IPosting,
    IPostingFields,
    IPostingInsertFields,
    IPostingConditionFields,
} from "./interfaces/posting";
export type {
    IChild,
    IFieldsRequestAvailabilityForWeb,
    IFieldsResponseAvailabilityForWeb,
} from "./interfaces/availability";
export type {
    IFieldsRequestChildrenCategories,
    IFieldsResponseChildrenCategories,
} from "./interfaces/ChildrenCategories";
export type {IRateListFields, IRateListConditionFields} from "./interfaces/RateList";
export type {IDeleteReservationOption} from "./interfaces/commands";
export type {INote, IOperation, IOperators, IDataType, IMethod, ReqType} from "./interfaces/types";
