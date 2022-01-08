export class PaginateDTO {
  skip?: number;
  take?: number;
  relation?: IRelation[] | string[];
  // relation?: string[];
  orderBy?: IOrderBy;
  filter?: IFilter[];
  filterAnd?: IFilter[];
}

export interface IFilter {
  fieldName: string;
  operation: FilterOptions;
  value: string[] | string;
}

export enum FilterOptions {
  'equals' = 'equals',
  'equalsignorecase' = 'equalsignorecase',
  'contains' = 'contains',
  'equalsForID' = 'equalsForID',
  'in' = 'in',
  'notIn' = 'notIn',
}

export interface IPaginationOUTData<T> {
  count: number;

  items: T[];
}

export interface IOrderBy {
  fieldName: string;
  order: 'ASC' | 'DESC';
}

export interface IRelation {
  alias: string;
  fieldToJoin: string;
}
