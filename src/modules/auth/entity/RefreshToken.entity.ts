import "reflect-metadata";
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../../modules/users/entity/user.entity";
import { v4 as uuidv4 } from "uuid";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "token", type: "varchar", length: 255, unique: true })
  token!: string;

  @Column({ name: "expires_at", type: "timestamp" })
  expiresAt!: Date;

  @Column({ name: "is_revoked", type: "boolean", default: false })
  isRevoked!: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user!: User;

  @BeforeInsert()
  generateToken() {
    this.token = uuidv4();
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
