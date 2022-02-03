import { Field, Int, InputType, ObjectType } from "@nestjs/graphql";
import { List } from "../entities/list.entity";

@ObjectType()
export class ListPagination {
    @Field(() => Int)
    count: number

    @Field(() => [List])
    items: List [];
}