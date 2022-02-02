import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { PaginateDTO } from '../@helpers/pagination/paginate.dto';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  create(@Body() createListDto: CreateListDto) {
    console.log(createListDto)
    return this.listService.create(createListDto);
  }

  @Get()
  findAll(@Body() pagination: PaginateDTO) {
    return this.listService.findAll(pagination);
  }

  @Get('/query')
  findAllQuery(@Body() pagination: PaginateDTO) {
    return this.listService.findAllQueryB(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    updateListDto.id = id;
    return this.listService.update(updateListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.listService.remove(id);
  }
  @Delete()
  removeMany(@Body('ids') ids: string[]) {
    return this.listService.removeMany(ids);
  }
}
