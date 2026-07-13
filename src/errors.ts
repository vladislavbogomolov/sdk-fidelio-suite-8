/**
 * Error thrown when the Fidelio interface answers with a non-OK status.
 */
export class FidelioError extends Error {
    readonly status: string;

    constructor(status: string, message: string) {
        super(message);
        this.name = 'FidelioError';
        this.status = status;
    }
}
