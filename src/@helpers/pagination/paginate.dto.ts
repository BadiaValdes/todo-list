import { InputType, Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";

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
@InputType()
export class IFilter {
  @Field()
  fieldName: string;
  @Field(type => FilterOptions)
  operation: FilterOptions;
  @Field(()=> [String])
  value: string[];
}

// INTERFACE FOR QUERY BUILDER WHERE CONSTRUCTION
@ObjectType()
export class IFilterOpParm {
  @Field()
  fieldName: string;
  @Field()
  operation: string;
  @Field(type => String)
  value: string;
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

registerEnumType(FilterOptions, {
  name: 'FilterOptions',
});

// INTERFACE FOR DATA OUTPUT
export class IPaginationOUTData<T> {
  count: number;
  items: T[];
}

// ORDERBY INTERFACE
@InputType()
export class IOrderBy {
  @Field()
  fieldName: string;
  @Field()
  order: 'ASC' | 'DESC';
}

// INTERFACE FOR QB RELATIONS
@InputType()
export class IRelation {
  @Field()
  alias: string;
  @Field()
  fieldToJoin: string;
}

// Pagination DTO Interface
@InputType()
export class PaginateDTOGrapQL {
  @Field(type => Int)
  skip?: number;
  @Field(type => Int)
  take?: number;
  // IN QUERY BUILDER ONLY WORKS IRELATION
  // U CAN USE BOTH IF U ARE NOT USING QB
  @Field(type => [IRelation])
  relation?: IRelation[];
  // relation?: string[];
  @Field(type => IOrderBy)
  orderBy?: IOrderBy;
  @Field(type => [IFilter])
  filter?: IFilter[];
  @Field(type => [IFilter])
  filterAnd?: IFilter[];
}
