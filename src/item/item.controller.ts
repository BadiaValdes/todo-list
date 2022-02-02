import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PaginateDTO } from 'src/@helpers/pagination/paginate.dto';
import { Item } from './entities/item.entity';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Get()
  findAll(@Body() paginate: PaginateDTO) {
    return this.itemService.findAll(paginate);
  }


  @Get("/query")
  findAllQuery(@Body() paginate: PaginateDTO) {
    return this.itemService.findAllQuery(paginate);
  }

  @Get("/item_trees")
  async findItemsTree(): Promise<Item[]> {
    return await this.itemService.findAllTree();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    updateItemDto.id = id;
    return this.itemService.update(id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }

  @Delete()
  removeMany(@Body('ids') ids: string[]) {
    return this.itemService.removeMany(ids);
  }
}
