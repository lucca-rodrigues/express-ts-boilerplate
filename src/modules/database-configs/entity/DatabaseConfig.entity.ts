import "reflect-metadata";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

// Enumeração para os tipos de banco de dados suportados
export enum DatabaseType {
  POSTGRES = "postgres",
  MYSQL = "mysql",
  MONGODB = "mongodb",
}

@Entity("database_configs")
export class DatabaseConfig {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({
    name: "database_type",
    type: "enum",
    enum: DatabaseType,
    default: DatabaseType.POSTGRES,
  })
  databaseType!: DatabaseType;

  @Column({ type: "varchar", length: 255 })
  host!: string;

  @Column({ type: "int" })
  port!: number;

  @Column({ type: "varchar", length: 100 })
  username!: string;

  @Column({ type: "varchar", length: 255 })
  password!: string;

  @Column({ type: "varchar", length: 100 })
  database!: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @Column({
    name: "connection_string",
    type: "varchar",
    length: 1000,
    nullable: true,
  })
  connectionString?: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ name: "workspace_id" })
  workspaceId!: string;

  @ManyToOne("Workspace", "databaseConfigs")
  @JoinColumn({ name: "workspace_id" })
  workspace!: any;
}
