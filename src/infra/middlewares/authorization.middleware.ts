import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { ApiKey } from "../../modules/api-keys/entity/ApiKey.entity";
import { DatabaseConfig } from "../../modules/database-configs/entity/DatabaseConfig.entity";
import createHttpError from "http-errors";

/**
 * Middleware que verifica se o usuário tem permissão para acessar o banco de dados
 * Deve ser usado em rotas que acessam banco de dados específicos
 */
export const databaseAccessAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const apiKey = req.headers["x-api-key"] as string;
    const databaseId = req.params.databaseId || req.body.databaseId;

    if (!apiKey) {
      throw createHttpError(401, "API Key não fornecida");
    }

    if (!databaseId) {
      throw createHttpError(400, "ID do banco de dados não fornecido");
    }

    // Verificar se a API Key é válida e obter o workspace associado
    const apiKeyRepository = AppDataSource.getRepository(ApiKey);
    const foundApiKey = await apiKeyRepository.findOne({
      where: { apiKey, isActive: true },
      relations: ["workspace"],
    });

    if (!foundApiKey) {
      throw createHttpError(401, "API Key inválida ou inativa");
    }

    // Verificar se o banco de dados pertence ao workspace da API Key
    const dbConfigRepository = AppDataSource.getRepository(DatabaseConfig);
    const databaseConfig = await dbConfigRepository.findOne({
      where: {
        id: databaseId,
        workspaceId: foundApiKey.workspaceId,
        isActive: true,
      },
    });

    if (!databaseConfig) {
      throw createHttpError(403, "Acesso negado a este banco de dados");
    }

    // Adicionar o workspace e configuração do banco ao objeto de requisição
    req.workspace = foundApiKey.workspace;
    req.databaseConfig = databaseConfig;

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware que verifica se o usuário é admin
 * Admins podem acessar todos os bancos de dados
 */
export const adminAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw createHttpError(401, "Usuário não autenticado");
    }

    // Verificar se o usuário é admin (pode ser implementado conforme necessário)
    const isAdmin = req.user?.isAdmin === true;

    if (!isAdmin) {
      throw createHttpError(403, "Acesso restrito a administradores");
    }

    next();
  } catch (error) {
    next(error);
  }
};
