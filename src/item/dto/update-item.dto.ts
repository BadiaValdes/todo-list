import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { List } from 'src/list/entities/list.entity';

export class UpdateItemDto extends PartialType(CreateItemDto) {
    id: string;
    itemName?: string;
    description?: string;
    marked?: boolean;
    list?: List;
    slug?: string;
}
