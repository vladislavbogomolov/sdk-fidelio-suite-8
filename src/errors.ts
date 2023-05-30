export class NotFoundError extends Error {
    constructor(message: any) {
        super(message); // (1)
        this.name = 'NotFoundError'; // (2)
    }
}
