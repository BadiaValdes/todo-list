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
  JoinColumn,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { List } from 'src/list/entities/list.entity';
import { Field, ObjectType, GraphQLISODateTime, Int } from '@nestjs/graphql';

@ObjectType()
@Entity('item')
@Tree('materialized-path')
// @Unique(["itemName", "list", "deletedAt"])
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  @Field(() => String)
  id: string;

  @Column({ name: 'item_name', type: 'varchar', length: 255, nullable: false })
  @Field(() => String)
  itemName: string;

  @Column({ name: 'slug', type: 'varchar', length: 255, nullable: false })
  @Field(() => String)
  slug: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  @Field(() => String)
  description: string;

  @Column({ name: 'marked', type: 'boolean', nullable: true, default: false })
  @Field(() => Boolean)
  marked: boolean;

  // @ManyToOne(() => List, (l) => l.items, { nullable: true })
  // @JoinColumn({ name: "list_id" })
  // list: List;

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
  @Field(() => Int)
  version: number;

  // Tree
  @TreeParent()
  @Field(() => Item)
  parentItem: Item;

  @TreeChildren()
  @Field(() => [Item])
  childrenItems: Item[];
}
