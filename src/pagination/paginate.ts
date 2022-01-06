import { IFilter, PaginateDTO, IPaginationOUTData } from './paginate.dto';
import { getRepository, EntityTarget, Like, ILike, In, Not } from 'typeorm';
import { isArray } from 'util';

export class Paginate {
  static async paginate<EntityModel>(
    model: EntityTarget<EntityModel>,
    paginate: PaginateDTO,
  ): Promise<IPaginationOUTData<EntityModel>> {
    let where = getFiltersOr(paginate.filter);
    if (paginate.filterAnd) getFiltersAnd(paginate.filterAnd, where);
    const [items, count] = await getRepository(model).findAndCount({
      skip: paginate.skip ? paginate.skip : 0,
      take: paginate.take ? paginate.take : 10000,
      where: where,
    });
    return { count, items };
  }
}

export function getFiltersOr(filterOr: IFilter[]) {
  let where = {};
  const whereArray = [];

  if (filterOr) {
    filterOr.forEach((data) => {
      where = {};
      let operation;
      if (data.operation === 'in' && isArray(data.value)) {
        operation = In(data.value);
        where[data.fieldName] = operation;
      } else if (data.operation === 'notIn' && isArray(data.value)) {
        operation = Not(In(data.value));
        where[data.fieldName] = operation;
      } else {
        let val = '';
        if (isArray(data.value)) {
          val = data.value[0];
        } else {
          val = data.value;
        }
        if (data.operation === 'equals') {
          operation = Like(val);
        } else if (data.operation === 'equalsignorecase') {
          operation = ILike(val);
        } else if (data.operation === 'contains') {
          operation = Like(`%${val}%`);
        } else if (data.operation === 'equalsForID') {
          operation = val;
        }
        where[data.fieldName] = operation;
      }
      whereArray.push(where);
    });
  }
  return whereArray;
}

export function getFiltersAnd(filterAnd: IFilter[], where) {
  if (filterAnd) {
    filterAnd.forEach((data) => {
      let operation;
      if (data.operation === 'in' && isArray(data.value)) {
        operation = In(data.value);
        where[0][data.fieldName] = operation;
      } else if (data.operation === 'notIn' && isArray(data.value)) {
        operation = Not(In(data.value));
        where[0][data.fieldName] = operation;
      } else {
        let val = '';
        if (isArray(data.value)) {
          val = data.value[0];
        } else {
          val = data.value;
        }
        if (data.operation === 'equals') {
          operation = Like(val);
        } else if (data.operation === 'equalsignorecase') {
          operation = ILike(val);
        } else if (data.operation === 'contains') {
          operation = Like(`%${val}%`);
        } else if (data.operation === 'equalsForID') {
          operation = val;
        }
        where[0][data.fieldName] = operation;
      }
      
    });
  }
}
