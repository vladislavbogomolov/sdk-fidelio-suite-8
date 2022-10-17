
export const Froms = (from: string): any => {


    return from ? {
        froms: {
            from
        }
    } : {}
}
