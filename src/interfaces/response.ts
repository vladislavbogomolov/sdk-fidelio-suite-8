export interface IFidelioResponse {
    fidelio: IFidelio
}


interface IFidelio {
    $: {
        Version: string
    },
    response: IResponse[]
}

interface IResponse {
    $: {
        ID: string,
        Status: IResponseStatus,
        Message?: string
    },
    queryResponse?: QueryResponse[];
    updateResponse?: QueryResponse[];
    insertResponse?: QueryResponse[];
}

export interface QueryResponse {
    rows: Row[];
    $?: {
        Name: "Reservation" | "Profile" | "Posting"
    }
}

export interface Row {
    row: Fields[];
}

export interface Fields {
    // fields: Field[]; maybe empty
    fields: any[];
}

export interface Field {
    field: any;
}


type IResponseStatus = "OK" | "CO" | "IA" | "NG" | "GA" | "NP" | "UR" | "IR" | "IC" | "AD" | "GF"