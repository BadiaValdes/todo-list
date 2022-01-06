import { EntityTarget, getRepository, ILike } from 'typeorm';

export class Validation {
  static async elementInDB<T>(
    field: string,
    value: string,
    model: EntityTarget<T>,
  ): Promise<T> {
    const where = {};
    where[field] = ILike(value);
    return await getRepository(model).findOne({
      where: where,
    });
  }

  static elementID(
    firstElementID: string,
    secondElementID: string[],    
  ): boolean {

    return secondElementID.includes(firstElementID);
  }
}
