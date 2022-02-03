import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  Unique,
  CreateDateColumn,
  VersionColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  ManyToOne,
  Tree,
  TreeParent,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Item } from 'src/item/entities/item.entity';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';

// ENUM
export enum ListVisibility {
    PUBLIC = "public",
    PRIVATE = "private"
}

@ObjectType()
@Entity('list')
@Unique(["name","creator","deletedAt"])
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(type => String)
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 255, nullable: false })
  @Field(type => String)
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 255, nullable: false })
  @Field(type => String, {nullable: true})
  slug: string;

  @Column({ name: 'visibility', type: 'enum', enum: ListVisibility, default: ListVisibility.PRIVATE})
  // @Field(type => ListVisibility, {nullable: true, defaultValue: ListVisibility.PRIVATE})
  visibility: ListVisibility;

  @Column({name: "selection_list", type:"boolean", default: false, nullable: true})
  @Field(type => Boolean, {nullable: true, defaultValue: false})
  selectionList: boolean;

  // @ManyToOne(()=>User, (u)=> u.list, {nullable: true})
  // @JoinColumn({ name: 'user_id' })
  // @Field(() => User, {nullable: true})
  // creator: User;

  @OneToMany(() => Item, (i) => i.list)
  @Field(type => [Item])
  items: Item[];

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'created_at' })
  @Field(() => GraphQLISODateTime, {
    description: 'UOM date of creation column',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  @Field(() => GraphQLISODateTime, {
    description: 'UOM date of creation column',
    nullable: false,
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  @Field(() => GraphQLISODateTime, {
    description: 'UOM date of creation column',
    nullable: false,
  })
  deletedAt: Date;

  @VersionColumn({ default: 1, nullable: true }) 
  version: number;
}

