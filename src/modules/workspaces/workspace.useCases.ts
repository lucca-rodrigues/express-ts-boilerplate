import {
  WorkspaceDto,
  WorkspaceResponseDto,
} from "modules/workspaces/dto/workspace.dto";
import { Workspace } from "modules/workspaces/entity/Workspace.entity";
import {
  workspaceRepository,
  databaseConfigRepository,
} from "infra/repository";
import { ErrorHandler } from "infra/errorHandlers";
import { DatabaseType } from "modules/database-configs/entity/DatabaseConfig.entity";
import { getWorkspaceConnection, getMongoConnection } from "data-source";
import {
  TableDefinitionDto,
  TableCreationResultDto,
} from "modules/workspaces/dto/table-definition.dto";
import { SqlQueryResultDto } from "modules/workspaces/dto/sql-query.dto";

export default class WorkspaceUseCases {
  constructor() {}

  async getAllByUserId(userId: string): Promise<WorkspaceResponseDto[]> {
    try {
      const workspaces = await workspaceRepository.find({
        where: { ownerId: userId },
        order: { createdAt: "DESC" },
      });

      return workspaces.map((workspace) => this.mapToResponseDto(workspace));
    } catch (error) {
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async getOneByIdAndUserId(
    workspaceId: string,
    userId: string
  ): Promise<WorkspaceResponseDto> {
    try {
      const workspace = await workspaceRepository.findOne({
        where: { id: workspaceId, ownerId: userId },
      });

      if (!workspace) {
        throw ErrorHandler.NotFound("Workspace not found");
      }

      return this.mapToResponseDto(workspace);
    } catch (error) {
      if (error instanceof Error && error.message === "Workspace not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async create(
    data: WorkspaceDto,
    userId: string
  ): Promise<WorkspaceResponseDto> {
    try {
      const workspace = workspaceRepository.create({
        ...data,
        ownerId: userId,
      });

      await workspaceRepository.save(workspace);

      return this.mapToResponseDto(workspace);
    } catch (error) {
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async update(
    workspaceId: string,
    data: WorkspaceDto,
    userId: string
  ): Promise<WorkspaceResponseDto> {
    try {
      const workspace = await workspaceRepository.findOne({
        where: { id: workspaceId, ownerId: userId },
      });

      if (!workspace) {
        throw ErrorHandler.NotFound("Workspace not found");
      }

      const updatedWorkspace = {
        ...workspace,
        ...data,
      };

      await workspaceRepository.save(updatedWorkspace);

      return this.mapToResponseDto(updatedWorkspace);
    } catch (error) {
      if (error instanceof Error && error.message === "Workspace not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async delete(workspaceId: string, userId: string): Promise<void> {
    try {
      const workspace = await workspaceRepository.findOne({
        where: { id: workspaceId, ownerId: userId },
      });

      if (!workspace) {
        throw ErrorHandler.NotFound("Workspace not found");
      }

      await workspaceRepository.remove(workspace);
    } catch (error) {
      if (error instanceof Error && error.message === "Workspace not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async checkUserAccess(workspaceId: string, userId: string): Promise<boolean> {
    try {
      const workspace = await workspaceRepository.findOne({
        where: { id: workspaceId, ownerId: userId },
      });

      return !!workspace;
    } catch (error) {
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async executeSql(
    workspaceId: string,
    databaseType: string,
    query: string
  ): Promise<SqlQueryResultDto> {
    try {
      // Verificar queries perigosas
      if (this.isDangerousQuery(query)) {
        throw ErrorHandler.BadRequest(
          "Dangerous query detected. Please avoid using DROP, TRUNCATE or DELETE without WHERE."
        );
      }

      // Buscar configuração de banco de dados
      const dbConfig = await databaseConfigRepository.findOne({
        where: {
          workspaceId,
          databaseType: databaseType as DatabaseType,
          isActive: true,
        },
      });

      if (!dbConfig) {
        throw ErrorHandler.NotFound("Database config not found");
      }

      // Executar query de acordo com o tipo de banco
      if (databaseType === DatabaseType.MONGODB) {
        throw ErrorHandler.BadRequest(
          "MongoDB queries should be executed through a different endpoint"
        );
      } else {
        // Para PostgreSQL e MySQL
        const connection = await getWorkspaceConnection(workspaceId, {
          type: databaseType as any,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
        });

        const result = await connection.query(query);

        return {
          success: true,
          data: result,
          rowCount: Array.isArray(result) ? result.length : 0,
        };
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Database config not found" ||
          error.message.includes("Dangerous query detected"))
      ) {
        throw error;
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async createTable(
    workspaceId: string,
    databaseType: string,
    data: TableDefinitionDto
  ): Promise<TableCreationResultDto> {
    try {
      // Validar tipo de banco
      if (!["postgres", "mysql", "mongodb"].includes(databaseType)) {
        throw ErrorHandler.BadRequest("Invalid database type");
      }

      // Buscar configuração de banco de dados
      const dbConfig = await databaseConfigRepository.findOne({
        where: {
          workspaceId,
          databaseType: databaseType as DatabaseType,
          isActive: true,
        },
      });

      if (!dbConfig) {
        throw ErrorHandler.NotFound("Database config not found");
      }

      // Criar tabela de acordo com o tipo de banco
      if (databaseType === DatabaseType.MONGODB) {
        // Para MongoDB, criamos uma coleção com validação
        const mongoClient = await getMongoConnection(workspaceId, {
          url:
            dbConfig.connectionString ||
            `mongodb://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`,
        });

        const db = mongoClient.db(dbConfig.database);

        // Criar coleção com validação se necessário
        await db.createCollection(data.name);

        // Criar índices para campos com unique ou primary
        const indexSpecs = data.columns
          .filter((col) => col.unique || col.primary)
          .map((col) => ({
            key: { [col.name]: 1 },
            name: `${col.name}_${col.unique ? "unique" : "primary"}`,
            unique: true,
          }));

        if (indexSpecs.length > 0) {
          const collection = db.collection(data.name);
          await Promise.all(
            indexSpecs.map((spec) =>
              collection.createIndex(spec.key, {
                name: spec.name,
                unique: true,
              })
            )
          );
        }

        return {
          success: true,
          message: `MongoDB collection '${data.name}' created successfully`,
        };
      } else {
        // Para PostgreSQL e MySQL
        const connection = await getWorkspaceConnection(workspaceId, {
          type: databaseType as any,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.database,
        });

        // Gerar SQL para criar tabela
        const createTableSQL = this.generateCreateTableSQL(data, databaseType);

        await connection.query(createTableSQL);

        return {
          success: true,
          message: `Table '${data.name}' created successfully`,
        };
      }
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Database config not found" ||
          error.message.includes("Invalid database type"))
      ) {
        throw error;
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private mapToResponseDto(workspace: Workspace): WorkspaceResponseDto {
    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      ownerId: workspace.ownerId,
      isActive: workspace.isActive,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }

  private isDangerousQuery(query: string): boolean {
    const normalizedQuery = query.toUpperCase().trim();

    // Verificar comandos perigosos
    if (
      normalizedQuery.includes("DROP TABLE") ||
      normalizedQuery.includes("DROP DATABASE") ||
      normalizedQuery.includes("TRUNCATE TABLE")
    ) {
      return true;
    }

    // Verificar DELETE sem WHERE
    if (
      normalizedQuery.includes("DELETE FROM") &&
      !normalizedQuery.includes("WHERE")
    ) {
      return true;
    }

    return false;
  }

  private generateCreateTableSQL(
    tableDefinition: TableDefinitionDto,
    databaseType: string
  ): string {
    const { name, columns } = tableDefinition;

    let columnDefinitions = columns
      .map((column) => {
        let columnType = column.type;

        // Mapear tipos para o banco específico
        if (databaseType === "postgres") {
          if (column.type === "string") columnType = "VARCHAR(255)";
          if (column.type === "number") columnType = "INTEGER";
          if (column.type === "boolean") columnType = "BOOLEAN";
          if (column.type === "timestamp") columnType = "TIMESTAMP";
          if (column.type === "uuid") columnType = "UUID";
        } else if (databaseType === "mysql") {
          if (column.type === "string") columnType = "VARCHAR(255)";
          if (column.type === "number") columnType = "INT";
          if (column.type === "boolean") columnType = "TINYINT(1)";
          if (column.type === "timestamp") columnType = "DATETIME";
          if (column.type === "uuid") columnType = "VARCHAR(36)";
        }

        let definition = `"${column.name}" ${columnType}`;

        if (column.primary) definition += " PRIMARY KEY";
        if (column.unique) definition += " UNIQUE";
        if (column.nullable === false) definition += " NOT NULL";
        if (column.default) definition += ` DEFAULT ${column.default}`;

        return definition;
      })
      .join(", ");

    return `CREATE TABLE "${name}" (${columnDefinitions})`;
  }
}
