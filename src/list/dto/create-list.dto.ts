import { ListVisibility } from "../entities/list.entity";
import { User } from "src/user/entities/user.entity";

export class CreateListDto {
  name: string;
  visibility: ListVisibility;
  creator?: User;
  selectionList: boolean;
}
