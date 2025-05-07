import { AppDataSource, getWorkspaceConnection } from "../../../data-source";
import { DatabaseConfig, DatabaseType } from "../entity/DatabaseConfig.entity";
import { User } from "../../users/entity/user.entity";
import { Workspace } from "../../workspaces/entity/Workspace.entity";
import createHttpError from "http-errors";

export class DatabaseConfigService {
  private dbConfigRepository = AppDataSource.getRepository(DatabaseConfig);

  /**
   * Cria uma nova configuração de banco de dados
   */
  async create(
    data: Partial<DatabaseConfig>,
    workspace: Workspace
  ): Promise<DatabaseConfig> {
    try {
      const newDbConfig = this.dbConfigRepository.create({
        ...data,
        workspaceId: workspace.id,
      });

      await this.dbConfigRepository.save(newDbConfig);
      return newDbConfig;
    } catch (error: any) {
      throw createHttpError(
        500,
        `Erro ao criar configuração de banco de dados: ${error.message}`
      );
    }
  }

  /**
   * Testa a conexão com um banco de dados
   */
  async testConnection(dbConfig: DatabaseConfig): Promise<boolean> {
    try {
      if (dbConfig.databaseType === DatabaseType.MONGODB) {
        // Implementação específica para MongoDB
        return true;
      }

      // Para bancos relacionais
      const connection = await getWorkspaceConnection(dbConfig.workspaceId, {
        type: dbConfig.databaseType,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
      });

      const isConnected = connection.isInitialized;

      // Fechar a conexão após o teste
      if (isConnected) {
        await connection.destroy();
      }

      return isConnected;
    } catch (error: any) {
      throw createHttpError(500, `Erro ao testar conexão: ${error.message}`);
    }
  }

  /**
   * Obtém uma configuração de banco de dados pelo ID
   */
  async findById(id: string): Promise<DatabaseConfig> {
    const dbConfig = await this.dbConfigRepository.findOneBy({ id });

    if (!dbConfig) {
      throw createHttpError(
        404,
        "Configuração de banco de dados não encontrada"
      );
    }

    return dbConfig;
  }

  /**
   * Lista as configurações de banco de dados de um workspace
   */
  async findByWorkspace(workspaceId: string): Promise<DatabaseConfig[]> {
    return this.dbConfigRepository.findBy({ workspaceId, isActive: true });
  }

  /**
   * Verifica se um usuário tem acesso a uma configuração de banco de dados
   */
  async checkUserAccessToDatabase(
    dbConfigId: string,
    user: User & { isAdmin?: boolean }
  ): Promise<boolean> {
    // Admins têm acesso a todos os bancos
    if (user.isAdmin) {
      return true;
    }

    // Verificar se o banco pertence a algum workspace do usuário
    const dbConfig = await this.dbConfigRepository.findOne({
      where: { id: dbConfigId },
      relations: ["workspace"],
    });

    if (!dbConfig) {
      return false;
    }

    return dbConfig.workspace.ownerId === user.id;
  }

  /**
   * Atualiza uma configuração de banco de dados
   */
  async update(
    id: string,
    data: Partial<DatabaseConfig>
  ): Promise<DatabaseConfig> {
    const dbConfig = await this.findById(id);

    // Atualizar propriedades
    Object.assign(dbConfig, data);

    await this.dbConfigRepository.save(dbConfig);
    return dbConfig;
  }

  /**
   * Desativa uma configuração de banco de dados
   */
  async deactivate(id: string): Promise<DatabaseConfig> {
    const dbConfig = await this.findById(id);

    dbConfig.isActive = false;

    await this.dbConfigRepository.save(dbConfig);
    return dbConfig;
  }
}
