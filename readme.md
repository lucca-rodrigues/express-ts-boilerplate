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
