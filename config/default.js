module.exports = {
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "ebaas",
  },
  security: {
    jwtSecret: process.env.JWT_SECRET || "ebaas-secret-key",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "10"),
  },
  api: {
    port: parseInt(process.env.PORT || "3000"),
    keyPrefix: process.env.API_KEY_PREFIX || "ebaas_",
  },
};
