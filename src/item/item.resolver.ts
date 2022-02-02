import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { Item } from "./entities/item.entity";
import { ItemService } from "./item.service";
import { CreateItemDto } from "./dto/create-item.dto";

@Resolver(of => Item)
export class ItemResolver {
    constructor(private readonly itemService: ItemService) {}
  
    @Query(returns => [Item])
    async itemsTree(): Promise<Item[]>{
        return await this.itemService.findAllTree()
    }

    @Mutation(returns => Item)
    async createItem(@Args("item") item: CreateItemDto){
        return await this.itemService.create(item);
    }
   
  }
  