import { SortOrder } from "../enums";

export const calculateOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};
export const transformSort = (
    sort: string,
): { field: string; sOrder: SortOrder } => {
    const field = sort.slice(1);
    switch (sort[0]) {
        case "-":
            return {
                field,
                sOrder: SortOrder.DESC,
            };
        default:
            return {
                field,
                sOrder: SortOrder.ASC,
            };
    }
};
