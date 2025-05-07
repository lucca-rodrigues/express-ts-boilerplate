module.exports = {
  database: {
    type: "sqlite",
    database: "src/infra/database/data.sqlite",
  },
  security: {
    jwtSecret: "test-secret-key",
    jwtExpiresIn: "1h",
    refreshTokenExpiresIn: "7d",
    bcryptSaltRounds: 4, // Menor para testes para ser mais rápido
  },
  api: {
    port: 3001,
    keyPrefix: "test_",
  },
};
