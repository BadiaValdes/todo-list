import { Entity, PrimaryGeneratedColumn, Index, Column } from "typeorm";

@Entity("test")
export class Test {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({ name: 'slug', type: 'varchar', length: 255, nullable: true })
  slug: string;
}