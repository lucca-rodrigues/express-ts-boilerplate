/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { DataSource } from "typeorm";
const dbSettings: { [key: string]: any } = {
  test: {
    type: "sqlite",
    database: "src/infra/database/data.db",
  },
  development: {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  production: {
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
};

export const AppDataSource = new DataSource({
  synchronize: false,
  logging: false,
  entities: ["src/modules/**/*.entity.ts"],
  migrations: [
    "src/infra/database/migrations/*.ts",
    "!src/infra/database/migrations/*.spec.ts",
  ],
  subscribers: [],
  ...dbSettings[process.env.NODE_ENV ?? "test"],
});
