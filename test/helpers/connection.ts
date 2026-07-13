import {Fidelio, IConnection} from "../../src";

/**
 * Builds the connection for the live integration tests from .env
 * (see .env.example). FIDELIO_URL wins; otherwise the URL is composed
 * from FIDELIO_ENDPOINT + FIDELIO_PATH + FIDELIO_CODE.
 */
export const connectionFromEnv = (): IConnection => {
    const url = process.env.FIDELIO_URL
        ?? `${process.env.FIDELIO_ENDPOINT ?? ''}${process.env.FIDELIO_PATH ?? ''}${process.env.FIDELIO_CODE ?? ''}`;

    return {
        URL: url,
        FIDELIO_USERNAME: process.env.FIDELIO_USERNAME ?? 'API',
        FIDELIO_PASSWORD: process.env.FIDELIO_PASSWORD ?? '',
        FIDELIO_VENDOR: process.env.FIDELIO_VENDOR ?? 'API',
        FIDELIO_VERSION: process.env.FIDELIO_VERSION ?? '1.1.0',
        USER_AGENT: process.env.USER_AGENT ?? 'FidelioNodeService',
        DEBUG_ENABLED: process.env.DEBUG_ENABLED === 'true',
    };
};

export const fidelioFromEnv = (): Fidelio => new Fidelio(connectionFromEnv());
