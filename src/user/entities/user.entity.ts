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
} from 'typeorm';

const dbcrypt = require('bcrypt');

@Entity('user')
@Unique(['userName'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column({ name: 'username', type: 'varchar', length: 40, nullable: false })
  userName: string;

  @Column({ name: 'email', type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ default: false })
  isStaff: boolean;

  @Column({ default: false })
  isSuperUser: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', nullable: true, name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date;

  @VersionColumn({ default: 1, nullable: true })
  version: number;

  private tempPass: string;

  @AfterLoad()
  private saveTempPass(): void {
    this.tempPass = this.password;
  }

  @BeforeInsert()
  private async encryptPassword(): Promise<void> {
    // Generate salt for encryptation
    const salt = await dbcrypt.genSalt();
    this.password = await dbcrypt.hash(this.password, salt);
  }

  @BeforeUpdate()
  private async encryptPasswordIfDifferent(): Promise<void> {
    if (!this.validatePassword(this.tempPass)) {
        this.encryptPassword();
    }
  }

  private async validatePassword(password: string): Promise<boolean> {
    return await dbcrypt.compare(password, this.password);
  }
}
