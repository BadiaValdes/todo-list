export class PaginateDTO {
  skip?: number;
  take?: number;
  // IN QUERY BUILDER ONLY WORKS IRELATION
  // U CAN USE BOTH IF U ARE NOT USING QB
  relation?: IRelation[] | string[];
  // relation?: string[];
  orderBy?: IOrderBy;
  filter?: IFilter[];
  filterAnd?: IFilter[];
}

// INTERFACE FOR FILTER CONSTRUCTION IN REQUEST
export interface IFilter {
  fieldName: string;
  operation: FilterOptions;
  value: string[] | string;
}

// INTERFACE FOR QUERY BUILDER WHERE CONSTRUCTION
export interface IFilterOpParm {
  fieldName: string;
  operation: string;
  value: string[] | string;
}

// FILTERS OPTIONS
export enum FilterOptions {
  'equals' = 'equals',
  'equalsignorecase' = 'equalsignorecase',
  'contains' = 'contains',
  'equalsForID' = 'equalsForID',
  'in' = 'in',
  'notIn' = 'notIn',
  'different' = 'different'
}

// INTERFACE FOR DATA OUTPUT
export interface IPaginationOUTData<T> {
  count: number;
  items: T[];
}

// ORDERBY INTERFACE
export interface IOrderBy {
  fieldName: string;
  order: 'ASC' | 'DESC';
}

// INTERFACE FOR QB RELATIONS
export interface IRelation {
  alias: string;
  fieldToJoin: string;
}
