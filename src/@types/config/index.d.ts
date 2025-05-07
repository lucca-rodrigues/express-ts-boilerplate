declare module "config" {
  export interface IConfig {
    database: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
      type?: string;
    };
    security: {
      jwtSecret: string;
      jwtExpiresIn: string;
      refreshTokenExpiresIn: string;
      bcryptSaltRounds: number;
    };
    api: {
      port: number;
      keyPrefix: string;
    };
  }

  const config: IConfig;
  export default config;
}
