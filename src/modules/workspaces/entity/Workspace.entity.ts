import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("workspaces")
export class Workspace {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description?: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ name: "owner_id" })
  ownerId!: string;

  @ManyToOne("User", "workspaces")
  @JoinColumn({ name: "owner_id" })
  owner!: any;

  @OneToMany("ApiKey", "workspace")
  apiKeys?: any[];

  @OneToMany("DatabaseConfig", "workspace")
  databaseConfigs?: any[];
}
