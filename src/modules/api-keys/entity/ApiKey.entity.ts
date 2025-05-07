import "reflect-metadata";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";
import config from "config";

@Entity("api_keys")
export class ApiKey {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ name: "api_key", type: "varchar", length: 255, unique: true })
  apiKey!: string;

  @Column({ name: "is_active", type: "boolean", default: true })
  isActive!: boolean;

  @Column({
    name: "expires_at",
    type: process.env.NODE_ENV === "test" ? "datetime" : "timestamp",
    nullable: true,
  })
  expiresAt?: Date;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ name: "workspace_id" })
  workspaceId!: string;

  @ManyToOne("Workspace", "apiKeys")
  @JoinColumn({ name: "workspace_id" })
  workspace!: any;

  @BeforeInsert()
  generateApiKey() {
    const keyPrefix = (config as any).api?.keyPrefix || "ebaas_";
    this.apiKey = `${keyPrefix}${uuidv4().replace(/-/g, "")}`;
  }
}
