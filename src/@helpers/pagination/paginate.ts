import {
  IFilter,
  PaginateDTO,
  IPaginationOUTData,
  IRelation,
  IFilterOpParm,
} from './paginate.dto';
import {
  getRepository,
  EntityTarget,
  Like,
  ILike,
  In,
  Not,
  FindOptionsUtils,
  JoinOptions,
} from 'typeorm';
import { isArray } from 'util';

export class Paginate {
  static async paginate<EntityModel>(
    model: EntityTarget<EntityModel>,
    paginate: PaginateDTO,
    tableAlias?: string,
  ): Promise<IPaginationOUTData<EntityModel>> {
    let where = {};

    // Create default order NONE
    let order = {};

    // Create default relation NONE
    let relations: { alias?: string; field?: string } = {};
    // let relations: string[] = [];

    console.log('HERE');
    // ADD the relations if exist
    if (paginate.relation) {
      for (const iterator of paginate.relation as IRelation[]) {
        relations[iterator.alias] = iterator.fieldToJoin;
      }
      // relations = paginate.relation as string[];
      console.log('relations');
      console.log(relations);
    }

    // Get filters
    if (paginate.filter) where = getFiltersOr(paginate.filter);
    // OR
    else where = getFiltersOr(paginate.filterAnd); // OR

    // ADD filter AND
    if (paginate.filter && paginate.filterAnd)
      getFiltersAnd(paginate.filterAnd, where);

    // ADD order to caos if exist
    if (paginate.orderBy) {
      order[paginate.orderBy.fieldName] = paginate.orderBy.order;
    }

    // Take items and count from repository
    const [items, count] = await getRepository(model).findAndCount({
      skip: paginate.skip ? paginate.skip : 0,
      take: paginate.take ? paginate.take : 10000,
      join: {
        alias: tableAlias,
        leftJoinAndSelect: relations,
      },
      // relations: relations,
      loadEagerRelations: true,
      where: where,
      order: order,
      cache: false,
    });

    return { count, items };
  }

  static async paginateQueryBuilder<EntityModel>(
    model: EntityTarget<EntityModel>,
    paginate: PaginateDTO,
    tableAlias?: string,
  ) {
    let queryBuilder = getRepository(model).createQueryBuilder(tableAlias);

    queryBuilder = queryBuilder.skip(paginate.skip).take(paginate.take);

    let where = '';
    let params = {};

    if (paginate.filter) {
      let filerOParam = getFilterOperationsAndParams(paginate.filter);
      [where, params] = constructWhere(filerOParam, false);
      queryBuilder = queryBuilder.where(where, params);

      console.log(where)
      console.log(params)
    }

    if (paginate.filterAnd) {
      let filerOParam = getFilterOperationsAndParams(paginate.filterAnd);
      [where, params] = constructWhere(filerOParam, true);
      queryBuilder = queryBuilder.where(where, params);
    }  

    if (paginate.relation)
      for (const iterator of paginate.relation as IRelation[]) {
        queryBuilder = queryBuilder.leftJoinAndSelect(
          iterator.fieldToJoin,
          iterator.alias,
        );
      }

    const [items, count] = await queryBuilder.getManyAndCount();
    
    return { items, count };
  }
}

export function getFiltersOr(filterOr: IFilter[]) {
  let where = {};
  const whereArray = [];

  if (filterOr) {
    filterOr.forEach((data) => {
      where = {};
      let operation;
      // Array filters
      if (data.operation === 'in' && isArray(data.value)) {
        operation = In(data.value);
      } else if (data.operation === 'notIn' && isArray(data.value)) {
        operation = Not(In(data.value));
      } else {
        // One Value filters
        let val = isArray(data.value) ? data.value[0] : data.value;
        if (data.operation === 'equals') {
          operation = Like(val);
        } else if (data.operation === 'equalsignorecase') {
          operation = ILike(val);
        } else if (data.operation === 'contains') {
          operation = Like(`%${val}%`);
        } else if (data.operation === 'equalsForID') {
          operation = val;
        }
      }
      if (data.fieldName.split('.').length > 1) {
        let j = {};
        for (
          let index = data.fieldName.split('.').length - 1;
          index > 0;
          index--
        ) {
          let z = {};
          if (index === data.fieldName.split('.').length - 1) {
            j[data.fieldName.split('.')[index]] = operation;
          } else {
            z[data.fieldName.split('.')[index]] = j;
            j = z;
          }
        }
        // j[data.fieldName.split('.')[1]] = operation;
        where[data.fieldName.split('.')[0]] = j;
      } else {
        where[data.fieldName] = operation;
      }
      whereArray.push(where);
      console.log(where);
    });
  }
  return whereArray;
}

export function getFiltersAnd(filterAnd: IFilter[], where) {
  if (filterAnd) {
    filterAnd.forEach((data) => {
      let operation;
      // Array filters
      if (data.operation === 'in' && isArray(data.value)) {
        operation = In(data.value);
      } else if (data.operation === 'notIn' && isArray(data.value)) {
        operation = Not(In(data.value));
      } else {
        // One Value filters
        let val = isArray(data.value) ? data.value[0] : data.value;
        if (data.operation === 'equals') {
          operation = Like(val);
        } else if (data.operation === 'equalsignorecase') {
          operation = ILike(val);
        } else if (data.operation === 'contains') {
          operation = Like(`%${val}%`);
        } else if (data.operation === 'equalsForID') {
          operation = val;
        }
      }
      if (data.fieldName.split('.').length > 1) {
        let j = {};
        for (
          let index = data.fieldName.split('.').length - 1;
          index > 0;
          index--
        ) {
          let z = {};
          if (index === data.fieldName.split('.').length - 1) {
            j[data.fieldName.split('.')[index]] = operation;
          } else {
            z[data.fieldName.split('.')[index]] = j;
            j = z;
          }
        }
        console.log(operation);
        // j[data.fieldName.split('.')[1]] = operation;
        where[where.length - 1][data.fieldName.split('.')[0]] = j;
      } else {
        where[where.length - 1][data.fieldName] = operation;
      }
    });
  }
}

export function constructWhere(filters: IFilterOpParm[], andFilter: boolean): [string, unknown] {
  let filterWhere = '';
  const filterParams = {};
  let paramCounter = 0;
  for (const iterator of filters) {
    if (filterWhere !== '') {
      filterWhere = `${filterWhere} ${andFilter? "and" : "or"} `;
    }
    if (iterator.operation === 'IN') {
      filterWhere += `${filterWhere} ${iterator.fieldName} ${iterator.operation} (:...value${paramCounter})`
      filterParams[`value${paramCounter}`] = (iterator.value as string).split(',');    
    } else if (iterator.operation === 'NOT IN') {
      filterWhere += `${filterWhere} ${iterator.fieldName} ${iterator.operation} (:...value${paramCounter})`
      filterParams[`value${paramCounter}`] = (iterator.value as string).split(',');  
    } else {
      filterWhere += `${filterWhere} ${iterator.fieldName} ${iterator.operation} :value${paramCounter}`;
      filterParams[`value${paramCounter}`] = iterator.value;
      
    }
    paramCounter++;
  }

  return [filterWhere, filterParams];
}

export function getFilterOperationsAndParams(
  filter: IFilter[],
): IFilterOpParm[] {
  const filterOpParam: IFilterOpParm[] = [];

  for (const iterator of filter) {
    switch (iterator.operation) {
      case 'equals':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: '=',
          value: `${iterator.value as string}`,
        });
        break;
      case 'equalsignorecase':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'ILIKE',
          value: `${iterator.value as string}`,
        });
        break;
      case 'contains':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'ILIKE',
          value: `%${iterator.value as string}%`,
        });
        break;
      case 'different':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'NOT ILIKE',
          value: `${iterator.value as string}`,
        });
        break;
      case 'in':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'IN',
          value: `${iterator.value as string[]}`,
        });
        break;
      case 'notIn':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'NOT IN',
          value: `${iterator.value as string[]}`,
        });
        break;
      default:
        break;
    }
  }
  return filterOpParam;
}
