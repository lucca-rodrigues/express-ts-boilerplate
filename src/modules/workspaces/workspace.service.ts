import { Request, Response } from "express";
import { WorkspaceDto } from "modules/workspaces/dto/workspace.dto";
import WorkspaceUseCases from "modules/workspaces/workspace.useCases";
import { AuthRequest } from "infra/middlewares";
import { SqlQueryDto } from "modules/workspaces/dto/sql-query.dto";
import { TableDefinitionDto } from "modules/workspaces/dto/table-definition.dto";

export default class WorkspaceService {
  private workspaceUseCases: WorkspaceUseCases;

  constructor(workspaceUseCases: WorkspaceUseCases) {
    this.workspaceUseCases = workspaceUseCases;
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = req.user.id;
      const workspaces = await this.workspaceUseCases.getAllByUserId(userId);
      return res.json(workspaces);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async getOne(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = req.user.id;
      const workspaceId = req.params.id;
      const workspace = await this.workspaceUseCases.getOneByIdAndUserId(
        workspaceId,
        userId
      );
      return res.json(workspace);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Workspace not found") {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async create(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = req.user.id;
      const data = req.body as WorkspaceDto;
      const workspace = await this.workspaceUseCases.create(data, userId);
      return res.status(201).json(workspace);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async update(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = req.user.id;
      const workspaceId = req.params.id;
      const data = req.body as WorkspaceDto;
      const workspace = await this.workspaceUseCases.update(
        workspaceId,
        data,
        userId
      );
      return res.json(workspace);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Workspace not found") {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async delete(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userId = req.user.id;
      const workspaceId = req.params.id;
      await this.workspaceUseCases.delete(workspaceId, userId);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Workspace not found") {
          return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async executeSql(req: AuthRequest, res: Response) {
    try {
      const workspaceId = req.params.id;
      const { databaseType, query } = req.body as SqlQueryDto;

      if (!req.user && !req.workspace) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Se não for autenticado por API Key, verificar se o usuário tem acesso ao workspace
      if (req.user && !req.workspace) {
        const userId = req.user.id;
        const hasAccess = await this.workspaceUseCases.checkUserAccess(
          workspaceId,
          userId
        );
        if (!hasAccess) {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      // Se for autenticado por API Key, verificar se a chave pertence ao workspace
      if (req.workspace && req.workspace.id !== workspaceId) {
        return res
          .status(403)
          .json({ error: "API Key not authorized for this workspace" });
      }

      const result = await this.workspaceUseCases.executeSql(
        workspaceId,
        databaseType,
        query
      );
      return res.json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message === "Workspace not found" ||
          error.message === "Database config not found"
        ) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("Dangerous query detected")) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async createTable(req: AuthRequest, res: Response) {
    try {
      const workspaceId = req.params.id;
      const databaseType = req.params.databaseType;
      const data = req.body as TableDefinitionDto;

      if (!req.user && !req.workspace) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Se não for autenticado por API Key, verificar se o usuário tem acesso ao workspace
      if (req.user && !req.workspace) {
        const userId = req.user.id;
        const hasAccess = await this.workspaceUseCases.checkUserAccess(
          workspaceId,
          userId
        );
        if (!hasAccess) {
          return res.status(403).json({ error: "Forbidden" });
        }
      }

      // Se for autenticado por API Key, verificar se a chave pertence ao workspace
      if (req.workspace && req.workspace.id !== workspaceId) {
        return res
          .status(403)
          .json({ error: "API Key not authorized for this workspace" });
      }

      const result = await this.workspaceUseCases.createTable(
        workspaceId,
        databaseType,
        data
      );
      return res.status(201).json(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (
          error.message === "Workspace not found" ||
          error.message === "Database config not found"
        ) {
          return res.status(404).json({ error: error.message });
        }
        if (error.message.includes("Invalid database type")) {
          return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
