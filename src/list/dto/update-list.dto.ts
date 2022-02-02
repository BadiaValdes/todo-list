import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { User } from 'src/user/entities/user.entity';
import { ListVisibility } from '../entities/list.entity';

export class UpdateListDto extends PartialType(CreateListDto) {
    id: string;
    name?: string;
    visibility?: ListVisibility;
    creator?: User;  
    slug?: string;
    selectionList?: boolean;
}
