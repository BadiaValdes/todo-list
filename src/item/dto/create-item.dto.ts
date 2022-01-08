import { List } from "src/list/entities/list.entity";

export class CreateItemDto {
  itemName: string;
  description: string;
  marked?: boolean;
  list: List;
}
