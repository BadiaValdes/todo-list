import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { List } from "./entities/list.entity";
import { ListService } from "./list.service";
import { CreateListDto } from "./dto/create-list.dto";
import { ListPagination} from './dto/paginate-list.dto'
import { PaginateDTO } from "src/user/dto/paginate-user.dto";
import { PaginateDTOGrapQL } from "src/@helpers/pagination/paginate.dto";

@Resolver(of => List)
export class ListResolver {
    constructor(private readonly listService: ListService) {}
  
    @Query(returns => ListPagination)
    async findAllList(
        @Args({name: "pagination", type: () => PaginateDTOGrapQL}) pagination : PaginateDTOGrapQL
    ){
        return await this.listService.findAllQB(pagination);
    }

    @Mutation(returns => List)
    async createList(
        @Args({name: "createDto", type: () => CreateListDto}) createDto : CreateListDto
    ){
        return await this.listService.create(createDto);
    }
   
  }
  