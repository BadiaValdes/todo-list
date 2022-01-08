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
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { List } from 'src/list/entities/list.entity';

@Entity('item')
@Unique(["itemName","list","deletedAt"])
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({ name: 'item_name', type: 'varchar', length: 255, nullable: false })
  itemName: string;

  @Column({ name: 'slug', type: 'varchar', length: 255, nullable: false })
  slug: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({name: 'marked', type: 'boolean', nullable: true, default: false})
  marked: boolean;

  @ManyToOne(()=> List, (l)=>l.items, {nullable: false})
  @JoinColumn({name: "list_id"})
  list: List

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @VersionColumn({ default: 1, nullable: true })
  version: number;

}
