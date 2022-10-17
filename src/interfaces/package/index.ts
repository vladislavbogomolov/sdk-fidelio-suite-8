export interface IPackage {
    PackageCode: string,
    PackageName: string,
    PackageWebDescription: string,
    PackageLongWebDescription: string,
    PackageWebMobileDescription: string,
    PackageLongWebMobileDescription: string,
    PackageFrequencyCode: string,
    PackageFrequencyName: string,
    PackageFrequencyWebName: string,
    PackageFrequencyWebMobileName: string,
    PackageCurrency: string,
    PackageStart: string,
    PackageEnd: string,
    PackagePrice: string,
    PackagePriceType: 0 | 1 | 2,
    PackageIncluded: string,
    PackageSinglePerRes: string,
    PackageShowInRes: 0 | 1,
    PackagePercentage: 1,
    PackageDisplOrder: number,
    PackagePriceChildCategory: any,
    PackageImage: any,
}

export type IPackageFields = keyof IPackage


export interface IPackageCondition{
    StartDate: string,
    EndDate: string,
    PackageCode: string,
    PackageIncluded: string,
    PackageShowInRes: string,
    ExcludeRateCode: string,
    ExcludeBlockCode: string,
    WebOnly: number,
}

export type IPackageConditionFields = keyof IPackageCondition
