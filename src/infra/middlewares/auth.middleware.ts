import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "config";
import { userRepository, apiKeyRepository } from "infra/repository";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  workspace?: {
    id: string;
  };
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Authorization header is required" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({ error: "Token error" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: "Token malformatted" });
    }

    jwt.verify(token, config.jwt.secret, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const decodedUser = decoded as { sub: string; email: string };

      // Verificar se o usuário existe
      const user = await userRepository.findOne({
        where: { id: decodedUser.sub },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      if (!user.isActive) {
        return res.status(401).json({ error: "User is inactive" });
      }

      // Adiciona o usuário ao objeto de requisição
      req.user = {
        id: decodedUser.sub,
        email: decodedUser.email,
      };

      return next();
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const authenticateApiKey = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers["x-api-key"] as string;

    if (!apiKey) {
      return res.status(401).json({ error: "API Key is required" });
    }

    // Buscar API Key no banco de dados
    const apiKeyEntity = await apiKeyRepository.findOne({
      where: { apiKey, isActive: true },
      relations: ["workspace"],
    });

    if (!apiKeyEntity) {
      return res.status(401).json({ error: "Invalid API Key" });
    }

    // Verificar se o workspace está ativo
    if (!apiKeyEntity.workspace.isActive) {
      return res.status(401).json({ error: "Workspace is inactive" });
    }

    // Verificar se a API Key está expirada
    if (apiKeyEntity.expiresAt && new Date() > apiKeyEntity.expiresAt) {
      return res.status(401).json({ error: "API Key expired" });
    }

    // Adiciona o workspace ao objeto de requisição
    req.workspace = {
      id: apiKeyEntity.workspaceId,
    };

    return next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
