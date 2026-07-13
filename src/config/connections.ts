export type IConnection = {
    /** Full DataHandler URL, including the ?ic= hotel code suffix */
    URL: string;
    FIDELIO_USERNAME: string;
    FIDELIO_PASSWORD: string;
    FIDELIO_VENDOR: string;
    /** XML interface version; defaults to 1.1.0 */
    FIDELIO_VERSION?: string;
    USER_AGENT?: string;
    DEBUG_ENABLED?: boolean;
    IS_MASTER?: boolean;
    /** Hotel code (informational) */
    CODE?: string;
    /** Per-request timeout in milliseconds; defaults to 60000, 0 disables */
    TIMEOUT_MS?: number;
}
