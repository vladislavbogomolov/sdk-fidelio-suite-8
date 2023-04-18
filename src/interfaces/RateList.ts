
export interface IRateListFields {
    RateCode: string,
    RateName: string,
    RateDepartment: string,
    RateWeekendDepartment: string,
    RateWebInfo: string,
    RateInfo: string,
    RateFolioText: string,
    RateStartSell: string,
    RateEndSell: string,
    RateMinLOS: string,
    RateMaxLOS: string,
    RatePublic: string,
    RateWebEnabled: string,
    RateBAR: string,
}

export interface IRateListConditionFields {
    RateCode: string;
    RateStartSell: string;
    RateEndSell: string;
    RatePublic: string;
    RateWebEnabled: number;
}