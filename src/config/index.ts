import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

export default {
  app: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "ebaas_main",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_jwt_secret_key",
    expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  security: {
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"),
  },
  api: {
    keyPrefix: process.env.API_KEY_PREFIX || "ebaas_",
  },
  supportedDatabases: ["postgres", "mysql", "mongodb"],
};
