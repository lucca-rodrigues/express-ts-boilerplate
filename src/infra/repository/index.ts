import { AppDataSource } from "../../data-source";

import { User } from "../../modules/users/entity/user.entity";
import { Workspace } from "../../modules/workspaces/entity/Workspace.entity";
import { ApiKey } from "../../modules/api-keys/entity/ApiKey.entity";
import { DatabaseConfig } from "../../modules/database-configs/entity/DatabaseConfig.entity";
import { RefreshToken } from "../../modules/auth/entity/RefreshToken.entity";

// Repositórios principais da aplicação
export const userRepository = AppDataSource.getRepository(User);
export const workspaceRepository = AppDataSource.getRepository(Workspace);
export const apiKeyRepository = AppDataSource.getRepository(ApiKey);
export const databaseConfigRepository =
  AppDataSource.getRepository(DatabaseConfig);
export const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
