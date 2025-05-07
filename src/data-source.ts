/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { MongoClient } from "mongodb";
import path from "path";

// Configurações padrão para os diferentes ambientes
const dbSettings: { [key: string]: any } = {
  test: {
    type: "sqlite",
    database: "src/infra/database/data.sqlite",
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

// Entidades a carregar apenas para a aplicação (não durante migrations)
const entitiesForApp =
  process.env.NODE_ENV === "test" ||
  process.argv.some((arg) => arg.includes("migration"))
    ? []
    : ["src/modules/**/*.entity.ts"];

// DataSource principal para o banco de dados da aplicação
export const AppDataSource = new DataSource({
  synchronize: false,
  logging: false,
  entities: entitiesForApp,
  migrations: [
    "src/infra/database/migrations/*.ts",
    "!src/infra/database/migrations/*.spec.ts",
  ],
  subscribers: [],
  ...dbSettings[process.env.NODE_ENV ?? "test"],
});

// Pool de conexões por workspace para PostgreSQL e MySQL
const dataSourceConnections: Map<string, DataSource> = new Map();

// Pool de conexões para MongoDB
const mongoConnections: Map<string, MongoClient> = new Map();

// Função para obter ou criar uma nova conexão TypeORM para PostgreSQL ou MySQL
export const getWorkspaceConnection = async (
  workspaceId: string,
  config: DataSourceOptions
): Promise<DataSource> => {
  const connectionKey = `${workspaceId}-${config.type}`;

  if (dataSourceConnections.has(connectionKey)) {
    const connection = dataSourceConnections.get(connectionKey);
    if (connection && connection.isInitialized) {
      return connection;
    }
  }

  // Criar nova conexão
  const newConnection = new DataSource({
    ...config,
    synchronize: false,
    logging: false,
  });

  await newConnection.initialize();
  dataSourceConnections.set(connectionKey, newConnection);
  return newConnection;
};

// Função para obter ou criar uma nova conexão MongoDB
export const getMongoConnection = async (
  workspaceId: string,
  config: { url: string }
): Promise<MongoClient> => {
  const connectionKey = `${workspaceId}-mongodb`;

  if (mongoConnections.has(connectionKey)) {
    const connection = mongoConnections.get(connectionKey);
    if (connection) {
      return connection;
    }
  }

  // Criar nova conexão
  const newConnection = new MongoClient(config.url);
  await newConnection.connect();
  mongoConnections.set(connectionKey, newConnection);
  return newConnection;
};

// Função para fechar uma conexão específica
export const closeWorkspaceConnection = async (
  workspaceId: string,
  type: string
): Promise<void> => {
  const connectionKey = `${workspaceId}-${type}`;

  if (type === "mongodb") {
    const mongoConnection = mongoConnections.get(connectionKey);
    if (mongoConnection) {
      await mongoConnection.close();
      mongoConnections.delete(connectionKey);
    }
  } else {
    const connection = dataSourceConnections.get(connectionKey);
    if (connection && connection.isInitialized) {
      await connection.destroy();
      dataSourceConnections.delete(connectionKey);
    }
  }
};

// Função para fechar todas as conexões
export const closeAllConnections = async (): Promise<void> => {
  // Fechar conexões TypeORM
  for (const [key, connection] of dataSourceConnections.entries()) {
    if (connection.isInitialized) {
      await connection.destroy();
    }
  }
  dataSourceConnections.clear();

  // Fechar conexões MongoDB
  for (const [key, connection] of mongoConnections.entries()) {
    await connection.close();
  }
  mongoConnections.clear();
};
