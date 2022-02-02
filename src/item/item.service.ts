import { Injectable } from "@nestjs/common";
import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "./entities/item.entity";
import { Repository, TreeRepository, getManager } from "typeorm";
import { Messages } from "src/@helpers/validations/messages";
import { Validation } from "src/@helpers/validations/db-data-validations";
import {
  PaginateDTO,
  FilterOptions,
} from "../@helpers/pagination/paginate.dto";
import { Paginate } from "../@helpers/pagination/paginate";
import { Slugify } from "src/@helpers/data-modification/data-modification";

@Injectable()
export class ItemService {
  constructor(
    @InjectRepository(Item)
    private itemRepo: Repository<Item>,
    @InjectRepository(Item)
    private itemTreeRepo: TreeRepository<Item>
  ) {}

  async create(createItemDto: CreateItemDto) {
    // await this.validateList(createItemDto);
    try{
    const valToCreate = this.itemRepo.create(createItemDto);
    console.log((createItemDto.parent))
    const findItem = this.itemRepo.findOne(
      createItemDto.parent
    );
    console.log(await findItem)
    valToCreate.parentItem = await findItem;
    console.log(valToCreate.parentItem)
    valToCreate.slug = Slugify(valToCreate.itemName, "_");
    return await this.itemRepo.save(valToCreate);
  }
  catch(e){
    throw Error("ERROR")
  }
  }

  async findAll(paginate: PaginateDTO) {
    // console.log((await Paginate.paginate(Item, paginate, "item")).items[0]);
    return await Paginate.paginate(Item, paginate, "item");
  }

  async findAllTree() {
    // console.log(await this.itemTreeRepo.findTrees())
    const manager = getManager();
    const trees = await manager.getTreeRepository(Item).findTrees();
    return trees;
    console.log(trees);
  }

  async findAllQuery(paginate: PaginateDTO) {
    console.log(await Paginate.paginateQueryBuilder(Item, paginate, "item"));
    return await Paginate.paginateQueryBuilder(Item, paginate, "item");
  }
  async findOne(id: string) {
    return await this.findAll({
      skip: 0,
      take: 1,
      filter: [
        {
          fieldName: "id",
          operation: "equalsForID" as FilterOptions,
          value: id,
        },
      ],
    });
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    await this.validateList(updateItemDto);
    updateItemDto.slug = Slugify(updateItemDto.itemName, "_");
    return this.itemRepo.save(updateItemDto);
  }

  async remove(id: string) {
    const oneToDelete = await this.itemRepo.findOne(id);
    return this.itemRepo.softRemove(oneToDelete);
  }

  async removeMany(ids: string[]) {
    const manyToDelete = await this.itemRepo.findByIds(ids);
    return this.itemRepo.softRemove(manyToDelete);
  }

  async validateList(data: CreateItemDto | UpdateItemDto) {
    if (data.itemName) {
      let listId: String = new String(data.list);
      const val = await this.findAll({
        skip: 0,
        take: 10,
        relation: [
          {
            alias: "list",
            fieldToJoin: "list",
          },
        ],
        filter: [
          {
            fieldName: "itemName",
            operation: "equalsignorecase" as FilterOptions,
            value: data.itemName,
          },
        ],
        filterAnd: [
          {
            fieldName: "list.id",
            operation: "equalsForID" as FilterOptions,
            value: listId.toString(),
          },
        ],
      });
      if (val.count > 0) {
        if ("id" in data) {
          if (!Validation.elementID(data.id, [val.items[0].id])) {
            console.log("dd");
            throw Error(Messages.elementExist);
          }
        } else {
          throw Error(Messages.elementExist);
        }
      }
    }
  }
}
