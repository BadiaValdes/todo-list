export class PaginateDTO {
    skip?: number;
    take?: number;
    relation?: string[];
    orderBy?: "ASC" | "DESC";
    filter?: IFilter[];
    filterAnd?: IFilter[];
}

export interface IFilter {
    fieldName: string;
    operation: "equals" | "equalsignorecase" | "contains" | "equalsForID";
    value: string;
}