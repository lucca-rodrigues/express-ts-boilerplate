## Prerequisites

Before you begin, ensure you have the following tools installed:

- Node.js (version 21 or higher)
- Yarn
- TypeScript
- TypeORM
- Plop
- Faker-js

## Installation

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Insert database credentials in the `.env` using sample `.env.example` file.**

3. **Execute migrations TypeORM:**

   ```sh
   npm run migrations:run
   ```

4. **Migrations undo TypeORM:**

   ```sh
   npm run migrations:undo
   ```

5. **Run the project:**
   ```sh
   npm run start:dev
   ```

## Migrations

### Create Migrations

To create a new migration, run:

```sh
npm run migrations:create --name=migrationName
```

## Integrando com o e-baas SDK

O e-baas pode ser integrado facilmente com sua aplicação front-end ou back-end. Abaixo estão alguns exemplos de como realizar a integração.

### Instalação do SDK Client

```sh
npm install e-baas-client
# ou
yarn add e-baas-client
```

### Configuração Básica

```javascript
import { EBaasClient } from "e-baas-client";

// Inicialização com token de autenticação de usuário
const clientWithToken = new EBaasClient({
  baseUrl: "http://localhost:3000/api",
  token: "seu-jwt-token-aqui",
});

// OU inicialização com API Key
const clientWithApiKey = new EBaasClient({
  baseUrl: "http://localhost:3000/api",
  apiKey: "sua-api-key-aqui",
});
```

### Exemplos de Uso

#### Autenticação

```javascript
// Registro de Usuário
const signUp = async () => {
  try {
    const result = await clientWithToken.auth.signUp({
      firstName: "João",
      lastName: "Silva",
      email: "joao@exemplo.com",
      password: "senha123",
    });
    console.log("Usuário registrado:", result.user);
    console.log("Access Token:", result.accessToken);
    console.log("Refresh Token:", result.refreshToken);
  } catch (error) {
    console.error("Erro ao registrar:", error);
  }
};

// Login
const signIn = async () => {
  try {
    const result = await clientWithToken.auth.signIn({
      email: "joao@exemplo.com",
      password: "senha123",
    });
    console.log("Login bem-sucedido:", result.user);
    console.log("Access Token:", result.accessToken);
    console.log("Refresh Token:", result.refreshToken);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
  }
};

// Atualizar Token
const refreshToken = async () => {
  try {
    const result = await clientWithToken.auth.refreshToken(
      "seu-refresh-token-aqui"
    );
    console.log("Novos tokens:", result);
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
  }
};
```

#### Workspaces

```javascript
// Listar workspaces
const listWorkspaces = async () => {
  try {
    const workspaces = await clientWithToken.workspaces.list();
    console.log("Workspaces:", workspaces);
  } catch (error) {
    console.error("Erro ao listar workspaces:", error);
  }
};

// Criar workspace
const createWorkspace = async () => {
  try {
    const workspace = await clientWithToken.workspaces.create({
      name: "Meu Projeto",
      description: "Descrição do meu projeto",
    });
    console.log("Workspace criado:", workspace);
  } catch (error) {
    console.error("Erro ao criar workspace:", error);
  }
};
```

#### Banco de Dados

```javascript
// Executar SQL
const executeSql = async () => {
  try {
    const result = await clientWithApiKey.database.sql({
      workspaceId: "workspace-id-aqui",
      databaseType: "postgres",
      query: "SELECT * FROM usuarios WHERE email = $1",
      params: ["usuario@exemplo.com"],
    });
    console.log("Resultado da consulta:", result.data);
    console.log("Total de linhas:", result.rowCount);
  } catch (error) {
    console.error("Erro ao executar SQL:", error);
  }
};

// Criar tabela
const createTable = async () => {
  try {
    const result = await clientWithApiKey.database.createTable({
      workspaceId: "workspace-id-aqui",
      databaseType: "postgres",
      name: "usuarios",
      columns: [
        {
          name: "id",
          type: "uuid",
          primary: true,
          nullable: false,
        },
        {
          name: "nome",
          type: "string",
          nullable: false,
        },
        {
          name: "email",
          type: "string",
          unique: true,
          nullable: false,
        },
      ],
    });
    console.log("Tabela criada:", result);
  } catch (error) {
    console.error("Erro ao criar tabela:", error);
  }
};
```

### Tratamento de Erros

O SDK inclui tratamento de erros padronizado:

```javascript
try {
  // Tentativa de operação
  const result = await clientWithToken.workspaces.list();
} catch (error) {
  if (error.statusCode === 401) {
    console.error("Erro de autenticação - Token inválido ou expirado");
  } else if (error.statusCode === 404) {
    console.error("Recurso não encontrado");
  } else {
    console.error("Erro desconhecido:", error.message);
  }
}
```

## API HTTP

Para testar a API diretamente, você pode usar o arquivo `doc.http` na raiz do projeto, que contém exemplos de todas as requisições disponíveis. Este arquivo é compatível com extensões como REST Client para VSCode.
