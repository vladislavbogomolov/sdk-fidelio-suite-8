import {RateList} from "../requests/objects/RateList";

export type ProfileType = 1 | 2 | 3
export type ProfileCategory = 1 | 2 | 3 | 4 | 5 | 6
export type ProfileID = number
export type ProfileExternalID = number
export type Guest3rdPartyID = string
export type ProfileGlobalID = number
export type GuestFirstname = string
export type GuestName = string
export type Title = string
export type AddressGreeting = string
export type LetterGreeting = string
export type Birthday = string
export type City = string
export type Street1 = string
export type Street2 = string
export type Street3 = string
export type ZIP = string
export type State = string
export type CountryISO2 = string
export type CountryISO3 = string
export type Name2 = string
export type LoginName = string
export type LoginPassword = string
export type CentralSyncTime = string
export type CorporateID = string
export type EMail = string

export type MembershipType = string


export type LastUpdateTime = string
export type CreationTime = string
export type Telephone = string
export type Email = string
export type Fax = string
export type Gender = "M" | "F"
export type DeleteCode = 0 | 1
export type NationalityISO2 = string
export type NationalityISO3 = string
export type Language = string
export type VipCode = string
export type CreditStatus = string
export type CreditReason = string
export type CreditStatusChangeTime = string
export type BirthPlace = string
export type Department = string
export type Position = string
export type GuestComment = string
export type NoEMailing = 0 | 1
export type NoMailing = 0 | 1
export type LinkedProfile = any
export type Membership = any
export type ProfileAttribute = any
export type ProfilePreference = any
export type ProfilePreferences = any
export type IncludeNotCommited = any
export type PersonalDocument = any



// Reservation
export type GuestNum = number
export type RoomType = string
export type RoomNum = string | number
export type GuestArrival = string
export type GuestDeparture = string
export type ReservationState = 0 | 1 | 2 | 3 | 4 | 5
export type ReservationStatus = 0 | 1 | 3
export type ReservationComment1 = string
export type ReservationComment2 = string
export type CheckinDateTime = string
export type CheckoutDateTime = string
export type ReservationType = "FA" | "RES"
export type NoAvailReason = 0 | 1 | 2 | 3 | 4
export type PaymentMethod = string
export type CrsSystem = string
export type CrsResNumber = string
export type NoOfRooms = number
export type NoOfAdults = number
export type RateCode = string
export type RateValue = number
export type ForeignRateValue = number
export type CurrencyCode = "EUR" | "USD" | "RUB"
export type MarketCode = string
export type CompanyID = number
export type TravelAgentID = number
export type SourceID = number
export type BookerID = number
export type BookerGlobalID = number
export type CompanyName = string
export type TravelAgentName = string
export type SourceName = string
export type BookerName = string
export type HasShare = 0 | 1
export type SourceCode = string
export type ChannelCode = string
export type GroupName = string
export type GroupID = number
export type Guarantee = string
export type TotalStay = number
export type ForeignTotalStay = number
export type BlockCode = string
export type NetRoomRevenue = number
export type PartyID = number
export type PartyName = string
export type ResStatusPriorCXL = 0 | 1
export type OptionDate = string
export type Policy = string
export type BedReservation = 0 | 1


export type AccompanyingGuestFirstName = string
export type AccompanyingGuestLastName = string
export type CreditCardNo = string
export type ExpiryMonth = string
export type ExpiryYear = string
export type CardholderName = string
export type CreditCardCode = string
export type ApprovalCode = string
export type ApprovalAmount = number
export type PackageCode = any
export type Waitlist = 1
export type AllowHouseOverbooking = 1
export type AllowRoomOverbooking = 1
export type SendConfirmation = any
export type ReservationPreference = any
export type RateRoomType = any
export type PostingID = number
export type DepartmentCode = number
export type DepartmentType = 1 | 2 | 3
export type PostingPrice = number
export type PostingQuantity = number
export type PostingDescription = string
export type PostingDate = string

export type INote = {
    value: string | number
    attr: string,
    subject?: "Profile" | "Reservation" | "Postings",
    subjectID?: number,
    name?: "Notes",
    addData?: number,
    noteID?: number,
    Delete?: 1,
}

export type ReservationAttribute = any
export type Child = {[key: string]: number}
export type AccompanyingGuests = {
    name: "AccompanyingGuest",
    name1?: string,
    name2?: string,
    name3?: string,
    BedGuestNum?: number,
    value: number,
    addData?: number | string,
    action?: "to_create"
}
export type AccompanyingGuest = any
export type ReservationDetails = any
export type DetailDate = any
export type PartyReservation = any
export type PartyMember = any
export type Share = any
export type CustomField = any
export type ReservationPreferences = any
export type Hints = any
export type Guest3rdPartyType = any


export type IOperation = "eq" | "neq" | "like" | "le" | "lt" | "ge" | "gt"
export type IOperators = "AND" | "OR" | "NOT"
export type ReqType = "Profile" | "Reservation" | "ProfileAndReservation" | "Package" | "Posting" | "FunctionSpaceAvailability" | "BonusPoint" | "BillingInstruction" | "ConferenceBooking" | "CustomQuery" | "ChildrenCategories" | "RateList"
export type IMethod = "update" | "query" | "insert"
export type IDataType = "String" | "Date" | "Float"
