export class PaginateDTO {
  skip?: number;
  take?: number;
  relation?: string[];
  orderBy?: 'ASC' | 'DESC';
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
  'notIn' = "notIn",
}

export interface IPaginationOUTData<T> {
  count: number;

  items: T[];
}
