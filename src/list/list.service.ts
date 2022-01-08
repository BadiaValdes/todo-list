import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';

import { Paginate } from '../@helpers/pagination/paginate';
import { Validation } from '../@helpers/validations/db-data-validations';
import { Messages } from '../@helpers/validations/messages';
import {
  PaginateDTO,
  FilterOptions,
} from 'src/@helpers/pagination/paginate.dto';
import {
  Slugify,
  replaceAll,
} from '../@helpers/data-modification/data-modification';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepo: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto) {
    await this.validateList(createListDto);
    const valToCreate = this.listRepo.create(createListDto);
    valToCreate.slug = Slugify(valToCreate.name, '_');
    return this.listRepo.save(valToCreate);
  }

  async findAll(pagination: PaginateDTO) {
    console.log((await Paginate.paginate<List>(List, pagination, 'list')).items[0].items)
    return await Paginate.paginate<List>(List, pagination, 'list');
  }

  async findAllQueryB(pagination: PaginateDTO) {
    return await Paginate.paginateQueryBuilder<List>(List, pagination, 'list');
  }

  async findOne(id: string) {
    return await this.findAll({
      skip: 0,
      take: 1,
      filter: [
        {
          fieldName: 'id',
          operation: 'equalsForID' as FilterOptions,
          value: id,
        },
      ],
    });
  }

  async update(updateListDto: UpdateListDto) {
    await this.validateList(updateListDto);
    updateListDto.slug = Slugify(updateListDto.name, "_")
    return this.listRepo.save(updateListDto);
  }

  async remove(id: string) {
    const oneToDelete = await this.listRepo.findOne(id)
    return this.listRepo.softRemove(oneToDelete);
  }

  async removeMany(ids: string[]) {
    const manyToDelete = await this.listRepo.findByIds(ids)
    return this.listRepo.softRemove(manyToDelete);
  }

  async validateList(data: CreateListDto | UpdateListDto) {
    if (data.name) {
      let userId: String = new String(data.creator);
      const val = await this.findAll({
        skip: 0,
        take: 10,
        relation: [
          {
            alias: 'creator',
            fieldToJoin: 'list.creator',
          },
        ],
        filter: [
          {
            fieldName: 'name',
            operation: 'equalsignorecase' as FilterOptions,
            value: data.name,
          },
        ],
        filterAnd: [
          {
            fieldName: 'creator.id',
            operation: 'equalsForID' as FilterOptions,
            value: userId.toString(),
          },
        ],
      });
      if (val.count > 0) {
        if ('id' in data) {
          if (!Validation.elementID(data.id, [val.items[0].id])) {
            console.log("dd")
            throw Error(Messages.elementExist);
          }
        } else {
          throw Error(Messages.elementExist);
        }
      }
    }
  }
}
