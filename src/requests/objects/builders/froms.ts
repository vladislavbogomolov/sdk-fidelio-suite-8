export const Froms = (from: string | null): any => {

    return from ? {
        froms: {
            from
        }
    } : {}
}
