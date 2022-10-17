export interface IChild {
    [attr: string]: number;
}

export interface IFieldsRequestAvailabilityForWeb {
    GuestArrival: Date,
    GuestDeparture: Date,
    NoOfAdults: number
    Child?: IChild
    NoOfRooms?: number
    RateCode?: string
    RoomType?: string
    WebOnly?: number
    MultipleRates?: number
    ProfileID?: number
    AvailabilityLimit?: string
    PricePerPerson?: string
    HotelSegmentCode?: string
    WebSalesCategory?: string
}


export interface IFieldsResponseAvailabilityForWeb {
    RateCode: string,
    RoomType: string,
    RoomTypeDesc: string,
    RoomTypeLongDesc: string,
    RoomTypeShortMobileDesc: string,
    RoomTypeLongMobileDesc: string,
    RoomTypeExtDesc: string,
    RoomTypeExtMobileDesc: string,
    Date: string,
    Price: string,
    PackagePrice: string,
    CurrencyCode: string,
    CurrencyISO3: string,
    DepartmentCode: string,
    BaseCurrencyPrice: string,
    Availability: string,
    RateMarket: string,
}
