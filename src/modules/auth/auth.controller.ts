import { Router } from "express";
import { validator } from "infra";
import AuthService from "modules/auth/auth.service";
import AuthUseCases from "modules/auth/auth.useCases";
import {
  SignInDto,
  SignUpDto,
  RefreshTokenDto,
} from "modules/auth/dto/auth.dto";

const controller = Router();
const authUseCases = new AuthUseCases();
const authService = new AuthService(authUseCases);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpDto'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       409:
 *         description: E-mail já está em uso
 *       500:
 *         description: Erro no servidor
 */
controller.post("/auth/signup", validator(SignUpDto), (req, res) =>
  authService.signUp(req, res)
);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Autentica um usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInDto'
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
controller.post("/auth/signin", validator(SignInDto), (req, res) =>
  authService.signIn(req, res)
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Atualiza o token de acesso usando um refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenDto'
 *     responses:
 *       200:
 *         description: Tokens atualizados com sucesso
 *       401:
 *         description: Token de atualização inválido ou expirado
 *       500:
 *         description: Erro no servidor
 */
controller.post("/auth/refresh", validator(RefreshTokenDto), (req, res) =>
  authService.refreshToken(req, res)
);

export default controller;
