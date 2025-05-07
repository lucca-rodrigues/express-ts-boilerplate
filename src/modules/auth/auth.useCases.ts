import { SignInDto, SignUpDto } from "./dto/auth.dto";
import { User } from "../../modules/users/entity/user.entity";
import { RefreshToken } from "./entity/RefreshToken.entity";
import { userRepository, refreshTokenRepository } from "../../infra/repository";
import { ErrorHandler } from "../../infra/errorHandlers";
import config from "../../config";
import jwt from "jsonwebtoken";
import { add } from "date-fns";

export default class AuthUseCases {
  constructor() {}

  async signUp(
    data: SignUpDto
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    try {
      // Verificar se o usuário já existe
      const existingUser = await userRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        throw ErrorHandler.BadRequest("Email already exists");
      }

      // Criar novo usuário
      const user = userRepository.create({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      await userRepository.save(user);

      // Gerar tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      return { user, accessToken, refreshToken };
    } catch (error) {
      if (error instanceof Error && error.message === "Email already exists") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async signIn(
    data: SignInDto
  ): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    try {
      // Buscar usuário com a senha (que normalmente está excluída nas consultas)
      const user = await userRepository.findOne({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw ErrorHandler.Unauthorized("Invalid credentials");
      }

      // Verificar senha
      const isPasswordValid = await user.comparePassword(data.password);
      if (!isPasswordValid) {
        throw ErrorHandler.Unauthorized("Invalid credentials");
      }

      // Verificar se o usuário está ativo
      if (!user.isActive) {
        throw ErrorHandler.Unauthorized("User account is disabled");
      }

      // Gerar tokens
      const { accessToken, refreshToken } = await this.generateTokens(user);

      return { user, accessToken, refreshToken };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Invalid credentials" ||
          error.message === "User account is disabled")
      ) {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Buscar o refresh token no banco
      const refreshTokenEntity = await refreshTokenRepository.findOne({
        where: { token },
        relations: ["user"],
      });

      if (!refreshTokenEntity) {
        throw ErrorHandler.Unauthorized("Invalid refresh token");
      }

      // Verificar se o token está expirado ou revogado
      if (refreshTokenEntity.isExpired() || refreshTokenEntity.isRevoked) {
        throw ErrorHandler.Unauthorized("Refresh token expired");
      }

      // Revogar o token atual
      refreshTokenEntity.isRevoked = true;
      await refreshTokenRepository.save(refreshTokenEntity);

      // Gerar novos tokens
      const { accessToken, refreshToken } = await this.generateTokens(
        refreshTokenEntity.user
      );

      return { accessToken, refreshToken };
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message === "Invalid refresh token" ||
          error.message === "Refresh token expired")
      ) {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  private async generateTokens(
    user: User
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Gerar access token
    const accessToken = jwt.sign(
      { sub: user.id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Criar refresh token
    const refreshTokenEntity = refreshTokenRepository.create({
      userId: user.id,
      expiresAt: add(new Date(), { days: 7 }), // Expira em 7 dias
    });

    await refreshTokenRepository.save(refreshTokenEntity);

    return {
      accessToken,
      refreshToken: refreshTokenEntity.token,
    };
  }
}
