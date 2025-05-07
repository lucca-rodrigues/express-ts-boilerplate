import "reflect-metadata";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcryptjs";
import config from "config";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "first_name", type: "varchar", length: 100 })
  firstName!: string;

  @Column({ name: "last_name", type: "varchar", length: 100 })
  lastName!: string;

  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 100, select: false })
  password!: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  // Feature flag para indicar se o usuário é admin (não está na tabela)
  isAdmin?: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  // Lazy loading para evitar importação circular
  @OneToMany("Workspace", "owner")
  workspaces?: Array<any>;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      // Usar o acesso indexado para evitar problemas de tipo
      const saltRounds = (config as any).security?.bcryptSaltRounds || 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
