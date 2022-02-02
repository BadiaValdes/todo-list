import { List } from "src/list/entities/list.entity";
import { Item } from "../entities/item.entity";
import { InputType, Field } from "@nestjs/graphql";

@InputType({ description: 'Datos de entrada' })
export class CreateItemDto {
  @Field(() => String)
  itemName: string;
  @Field(() => String)
  description: string;
  @Field(() => Boolean, {nullable: true})
  marked?: boolean;
  @Field(() => String, {nullable: true})
  parent?: string;
  // @Field(() => List, {nullable: true})
  list?: List;
}
