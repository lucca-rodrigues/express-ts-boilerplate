Você é um assistente de desenvolvimento backend especializado em Node.js. Sua tarefa é gerar todo o código necessário para criar uma API RESTful que simule as funcionalidades básicas do Supabase, porém de forma simplificada e adequada tanto para usuários NoCode quanto para desenvolvedores que consumirão via SDK. A API deve incluir:

1. Autenticação e Autorização

   - Endpoints de registro (`POST /auth/signup`) e login (`POST /auth/signin`) com armazenamento seguro de credenciais (hash de senha).
   - Proteção de rotas usando JWT, com refresh tokens.
   - Geração de API Keys únicas por workspace.

2. Gerenciamento de Workspaces/Projetos

   - Endpoint para criação de workspace (`POST /workspaces`) e listagem (`GET /workspaces`).
   - Cada workspace deve ter suas próprias configurações de banco e API Keys.
   - Endpoint para gerar, revogar e listar API Keys de cada workspace (`POST /workspaces/:id/keys` etc).

3. Provisionamento Dinâmico de Bancos de Dados

   - Suporte a múltiplos tipos: PostgreSQL, MySQL e MongoDB.
   - Ao criar um novo workspace, permitir ao usuário escolher quais bancos vão existir e suas credenciais.
   - Gerar conexões dinâmicas com pooling para cada banco de cada workspace, isolando contexto de cada requisição.

4. Execução de Comandos SQL (para relacionais)

   - Endpoint genérico (`POST /workspaces/:id/sql`) que receba:
     • `databaseType` (postgres | mysql)
     • `query` (string SQL de criação/alteração de tabelas, inserção, seleção)
   - Validação básica para evitar comandos perigosos (DROP \*, DELETE sem WHERE).
   - Retornar resultados ou mensagens de erro de forma padronizada.

5. Abstração CRUD via SDK

   - Gerar um pacote NPM/TypeScript SDK que seja capaz de:
     • Conectar-se via API Key a um workspace.
     • Executar operações CRUD (create, read, update, delete) em tabelas relacionais.
     • Executar consultas MongoDB (insertOne, find, updateOne, deleteOne).
     • Funções utilitárias de migração de esquema e introspecção de tabelas.

6. Interface NoCode (endpoints simplificados)

   - Endpoints para criar tabela sem SQL (`POST /workspaces/:id/tables`) recebendo JSON:
     {
     “name”: “users”,
     “columns”: [
     { “name”: “id”, “type”: “uuid”, “primary”: true },
     { “name”: “email”, “type”: “string”, “unique”: true },
     { “name”: “created_at”, “type”: “timestamp”, “default”: “now()” }
     ]
     }
   - Equivalente para MySQL (tipos compatíveis) e para MongoDB coleções (definição de índices).

7. Arquitetura e Boas Práticas

   - Estrutura de pastas modular (Controllers, Services, Repositories, Middlewares).
   - Uso de TypeScript, DDD leve e injeção de dependências.
   - Testes unitários e de integração (Jest ou Mocha + Chai).
   - Documentação automática de API (Swagger/OpenAPI).

8. Deploy e Infraestrutura
   - Script de containerização com Docker (Dockerfile + docker-compose.yml).
   - Configuração de variáveis de ambiente para conexões de banco e JWT.
   - Exemplos de CI/CD simples com GitHub Actions.

**Objetivo final**: entregar um projeto completo em Node.js/TypeScript com todos os endpoints, SDK, testes e documentação, pronto para ser extendido em produção. Gere também exemplos de uso do SDK e de payloads JSON para os endpoints NoCode.
@Web
Faça o clone da estrutura inicial do @https://github.com/lucca-rodrigues/express-ts-boilerplate mova os arquivos do repositprio para a pasta raiz do e-baas e depois faça o desenvolvimento seguindo o mesmo padrão de arquitetura e npm run gen para gerar novosw módulos
