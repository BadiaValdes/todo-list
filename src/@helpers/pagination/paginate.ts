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
    // WHERE OR | AND
    let whereOr = {};
    let whereAnd = {};

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
    if (paginate.filter) whereOr = getFiltersOr(paginate.filter);

    // ADD filter AND
    if (paginate.filter && paginate.filterAnd)
    {
     whereAnd = getFiltersOr(paginate.filterAnd);
    }

    if(whereOr !== {}){
      whereOr[(whereOr as Array<any>).length - 1] = whereAnd
    }
    else {
      whereOr = whereAnd;
    }

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
      where: whereOr,
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

    // Query Builder
    let queryBuilder = getRepository(model).createQueryBuilder(tableAlias);

    // Asign skip and take params
    queryBuilder = queryBuilder.skip(paginate.skip).take(paginate.take);

    // Create where and params variables
    let where = '';
    let params = {};

    // If filter OR exist, create the where claus
    if (paginate.filter) {
      let filerOParam = getFilterOperationsAndParams(paginate.filter);
      [where, params] = constructWhere(filerOParam, false);
      queryBuilder = queryBuilder.where(where, params);

      console.log(where);
      console.log(params);
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

// export function getFiltersAnd(filterAnd: IFilter[], where) {
//   if (filterAnd) {
//     filterAnd.forEach((data) => {
//       let operation;
//       // Array filters
//       if (data.operation === 'in' && isArray(data.value)) {
//         operation = In(data.value);
//       } else if (data.operation === 'notIn' && isArray(data.value)) {
//         operation = Not(In(data.value));
//       } else {
//         // One Value filters
//         let val = isArray(data.value) ? data.value[0] : data.value;
//         if (data.operation === 'equals') {
//           operation = Like(val);
//         } else if (data.operation === 'equalsignorecase') {
//           operation = ILike(val);
//         } else if (data.operation === 'contains') {
//           operation = Like(`%${val}%`);
//         } else if (data.operation === 'equalsForID') {
//           operation = val;
//         }
//       }
//       if (data.fieldName.split('.').length > 1) {
//         let j = {};
//         for (
//           let index = data.fieldName.split('.').length - 1;
//           index > 0;
//           index--
//         ) {
//           let z = {};
//           if (index === data.fieldName.split('.').length - 1) {
//             j[data.fieldName.split('.')[index]] = operation;
//           } else {
//             z[data.fieldName.split('.')[index]] = j;
//             j = z;
//           }
//         }
//         console.log(operation);
//         // j[data.fieldName.split('.')[1]] = operation;
//         where[where.length - 1][data.fieldName.split('.')[0]] = j;
//       } else {
//         where[where.length - 1][data.fieldName] = operation;
//       }
//     });
//   }
// }

// Where sentence builder
export function constructWhere(
  filters: IFilterOpParm[],
  andFilter: boolean,
): [string, unknown] {
  // Where sentece
  let filterWhere = '';

  // Where params
  const filterParams = {};

  // For dynamic where params creation
  let paramCounter = 0;

  // Iterate over the where filters created in getFilterOperationsAndParams
  for (const iterator of filters) {
    // If the where variable is not empty, append and | or for query construction.
    if (filterWhere !== '') {
      filterWhere = `${filterWhere} ${andFilter ? 'and' : 'or'} `;
    }

    // Particular case of using IN or NOT IN where query 
    if (iterator.operation === 'IN') {
      filterWhere += `${filterWhere} ${iterator.fieldName} ${iterator.operation} (:...value${paramCounter})`;
      filterParams[`value${paramCounter}`] = (iterator.value[0] as string).split(
        ',',
      );
    } else if (iterator.operation === 'NOT IN') {
      filterWhere += `${filterWhere} ${iterator.fieldName} ${iterator.operation} (:...value${paramCounter})`;
      filterParams[`value${paramCounter}`] = (iterator.value[0] as string).split(
        ',',
      );
    } else {
      // All others necessary where clauses for the query builder
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
  // THE FILTERS BECOME THE PARTS OF THE CLAUSE WHERE
  const filterOpParam: IFilterOpParm[] = [];
  
  /**
   * ESTRUCTURE:
   *  fieldName -> Search field
   *  operation -> Structure allowed operations into readable where operations
   *  value -> Value to comparation
   * */

  // ITERATE OVER ALL THE FILTERS
  for (const iterator of filter) {
    // USING THE FILTER OPERATING VALUE AS A CONSTRUCTION INDICATOR
    switch (iterator.operation) {
      case 'equals':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: '=',
          value: `${iterator.value[0] as string}`,
        });
        break;
      case 'equalsignorecase':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'ILIKE',
          value: `${iterator.value[0] as string}`,
        });
        break;
      case 'contains':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'ILIKE',
          value: `%${iterator.value[0] as string}%`,
        });
        break;
      case 'different':
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'NOT ILIKE',
          value: `${iterator.value[0] as string}`,
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
      // The default filter will be equalsignorecase
      default:
        filterOpParam.push({
          fieldName: iterator.fieldName,
          operation: 'ILIKE',
          value: `${iterator.value as string[]}`,
        });
        break;
    }
  }
  return filterOpParam;
}
