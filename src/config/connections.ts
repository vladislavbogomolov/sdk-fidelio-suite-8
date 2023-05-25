export type IConnection = {
    IS_MASTER: boolean;
    USER_AGENT: string;
    FIDELIO_VERSION: string;
    FIDELIO_USERNAME: string;
    DEBUG_ENABLED: boolean;
    FIDELIO_VENDOR: string;
    FIDELIO_PASSWORD: string;
    CODE: string;
    URL: string
}
export const Connections: IConnection[] = [
    {
        URL: "",
        CODE: "PATEST",
        FIDELIO_VERSION: "1.1.0",
        FIDELIO_VENDOR: "sdk-fidelio-suite",
        FIDELIO_USERNAME: "",
        FIDELIO_PASSWORD: "",
        USER_AGENT: "FidelioNodeService",
        DEBUG_ENABLED: false,
        IS_MASTER: true
    }
]