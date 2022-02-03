import { PartialType } from '@nestjs/mapped-types';
import { CreateListDto } from './create-list.dto';
import { User } from 'src/user/entities/user.entity';
import { ListVisibility } from '../entities/list.entity';
import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: 'Datos de entrada' })
export class UpdateListDto extends PartialType(CreateListDto) {
    @Field(_ => String)
    id: string;
    @Field(_ => String)
    name: string;
    @Field(_ => String, {nullable: true})
    slug: string;
    // @Field(_ => ListVisibility, {nullable: true})
    // visibility?: ListVisibility;
    @Field(_ => User, {nullable: true})
    creator?: User;
    @Field(_ => Boolean, {nullable: true, defaultValue: false})
    selectionList?: boolean;
}
