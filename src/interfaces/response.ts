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
    fields: Field[];
}

export interface Field {
    field: any;
}


type IResponseStatus = "OK" | "CO" | "IA" | "NG" | "GA" | "NP" | "UR" | "IR" | "IC" | "AD" | "GF"


/*const x: IFidelioResponse = {
    fidelio: {
        $: {
            Version: "1.1.0"
        },
        response: [
            {
                $: {
                    ID: "1234",
                    Status: "OK",
                    Message: "134323"
                },
                queryResponse: [
                    {
                        rows: [
                            {
                                row: [
                                    {
                                        fields: [
                                            {
                                                field: {
                                                    Good: ""
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
*/
