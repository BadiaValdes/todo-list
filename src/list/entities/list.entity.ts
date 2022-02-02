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
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Item } from 'src/item/entities/item.entity';

// ENUM
export enum ListVisibility {
    PUBLIC = "public",
    PRIVATE = "private"
}


@Entity('list')
@Unique(["name","creator","deletedAt"])
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ name: 'slug', type: 'varchar', length: 255, nullable: false })
  slug: string;

  @Column({ name: 'visibility', type: 'enum', enum: ListVisibility, default: ListVisibility.PRIVATE})
  visibility: ListVisibility;

  @Column({name: "selection_list", type:"boolean", default: false, nullable: true})
  selectionList: boolean;

  @ManyToOne(()=>User, (u)=> u.list, {nullable: true})
  creator: User;

  // @OneToMany(() => Item, (i) => i.list)
  // items: List[];

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @VersionColumn({ default: 1, nullable: true })
  version: number;

}

