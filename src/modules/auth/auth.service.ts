import { Request, Response } from "express";
import {
  SignInDto,
  SignUpDto,
  RefreshTokenDto,
} from "modules/auth/dto/auth.dto";
import AuthUseCases from "modules/auth/auth.useCases";
import { UserResponseDto } from "modules/users/dto/user.dto";

export default class AuthService {
  private authUseCases: AuthUseCases;

  constructor(authUseCases: AuthUseCases) {
    this.authUseCases = authUseCases;
  }

  async signUp(req: Request, res: Response) {
    try {
      const data = req.body as SignUpDto;
      const { user, accessToken, refreshToken } =
        await this.authUseCases.signUp(data);

      const userResponse: UserResponseDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.status(201).json({
        user: userResponse,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (error.message === "Email already exists") {
        return res.status(409).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async signIn(req: Request, res: Response) {
    try {
      const data = req.body as SignInDto;
      const { user, accessToken, refreshToken } =
        await this.authUseCases.signIn(data);

      const userResponse: UserResponseDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.status(200).json({
        user: userResponse,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (error.message === "Invalid credentials") {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const data = req.body as RefreshTokenDto;
      const { accessToken, refreshToken } =
        await this.authUseCases.refreshToken(data.refreshToken);

      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      if (
        error.message === "Invalid refresh token" ||
        error.message === "Refresh token expired"
      ) {
        return res.status(401).json({ error: error.message });
      }
      return res.status(500).json({ error: error.message });
    }
  }
}
