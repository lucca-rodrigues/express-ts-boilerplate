import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1717366400000 implements MigrationInterface {
  name = "CreateInitialTables1717366400000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criando a extensão UUID primeiro (para PostgreSQL)
    try {
      await queryRunner.query(`
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp"
      `);
    } catch (error) {
      // Ignorar erro caso esteja usando SQLite em ambiente de teste
      console.warn(
        "Ignorando erro ao criar extensão uuid-ossp (provavelmente SQLite):",
        error
      );
    }

    // Criando a tabela de usuários
    await queryRunner.query(`
        CREATE TABLE "users" (
            "id" varchar PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            "first_name" varchar(100) NOT NULL,
            "last_name" varchar(100) NOT NULL,
            "email" varchar(255) NOT NULL UNIQUE,
            "password" varchar(100) NOT NULL,
            "is_active" boolean NOT NULL DEFAULT true,
            "created_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "updated_at" TIMESTAMP NOT NULL DEFAULT current_timestamp
        )
    `);

    // Criando a tabela de workspaces
    await queryRunner.query(`
        CREATE TABLE "workspaces" (
            "id" varchar PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            "name" varchar(100) NOT NULL,
            "description" varchar(255),
            "is_active" boolean NOT NULL DEFAULT true,
            "created_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "updated_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "owner_id" varchar NOT NULL,
            CONSTRAINT "fk_workspaces_owner" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE
        )
    `);

    // Criando a tabela de chaves de API
    await queryRunner.query(`
        CREATE TABLE "api_keys" (
            "id" varchar PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            "name" varchar(100) NOT NULL,
            "api_key" varchar(255) NOT NULL UNIQUE,
            "is_active" boolean NOT NULL DEFAULT true,
            "expires_at" TIMESTAMP,
            "created_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "updated_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "workspace_id" varchar NOT NULL,
            CONSTRAINT "fk_api_keys_workspace" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
        )
    `);

    // Criando a tabela de configurações de banco de dados
    try {
      await queryRunner.query(`
          CREATE TYPE "database_type_enum" AS ENUM ('postgres', 'mysql', 'mongodb')
      `);
    } catch (error) {
      // SQLite não suporta tipos ENUM, criar apenas a tabela
      console.warn(
        "Ignorando erro ao criar database_type_enum (provavelmente SQLite):",
        error
      );
    }

    await queryRunner.query(`
        CREATE TABLE "database_configs" (
            "id" varchar PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            "name" varchar(100) NOT NULL,
            "database_type" varchar NOT NULL DEFAULT 'postgres',
            "host" varchar(255) NOT NULL,
            "port" integer NOT NULL,
            "username" varchar(100) NOT NULL,
            "password" varchar(255) NOT NULL,
            "database" varchar(100) NOT NULL,
            "is_active" boolean NOT NULL DEFAULT true,
            "connection_string" varchar(1000),
            "created_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "updated_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "workspace_id" varchar NOT NULL,
            CONSTRAINT "fk_database_configs_workspace" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE CASCADE
        )
    `);

    // Criando a tabela de refresh tokens
    await queryRunner.query(`
        CREATE TABLE "refresh_tokens" (
            "id" varchar PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
            "token" varchar(255) NOT NULL UNIQUE,
            "expires_at" TIMESTAMP NOT NULL,
            "is_revoked" boolean NOT NULL DEFAULT false,
            "created_at" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "user_id" varchar NOT NULL,
            CONSTRAINT "fk_refresh_tokens_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Removendo as tabelas na ordem inversa de dependência
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "database_configs"`);
    try {
      await queryRunner.query(`DROP TYPE "database_type_enum"`);
    } catch (error) {
      console.warn(
        "Ignorando erro ao remover database_type_enum (provavelmente SQLite):",
        error
      );
    }
    await queryRunner.query(`DROP TABLE "api_keys"`);
    await queryRunner.query(`DROP TABLE "workspaces"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
