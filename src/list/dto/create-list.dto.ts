import { ListVisibility } from "../entities/list.entity";
import { User } from "src/user/entities/user.entity";
import { InputType, Field } from "@nestjs/graphql";

@InputType({ description: 'Datos de entrada' })
export class CreateListDto {
  @Field(_ => String)
  name: string;
  // @Field(_ => ListVisibility, {nullable: true})
  // visibility?: ListVisibility;
  @Field(_ => User, {nullable: true})
  creator?: User;
  @Field(_ => Boolean, {nullable: true, defaultValue: false})
  selectionList?: boolean;
}
