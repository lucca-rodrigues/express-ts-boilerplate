import { User } from "../../modules/users/entity/user.entity";
import { Workspace } from "../../modules/workspaces/entity/Workspace.entity";
import { DatabaseConfig } from "../../modules/database-configs/entity/DatabaseConfig.entity";

declare global {
  namespace Express {
    interface Request {
      user?: User & { isAdmin?: boolean };
      workspace?: Workspace;
      databaseConfig?: DatabaseConfig;
    }
  }
}
