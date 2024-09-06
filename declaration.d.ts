// src/@types/pagarme.d.ts
import "pagarme-js-types/src/index";

declare module "pagarme" {
  export const client: {
    connect: (config: { email: string; password: string }) => Promise<any>;
  };
}
