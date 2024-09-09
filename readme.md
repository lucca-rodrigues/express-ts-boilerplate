## Setup Commands

```sh
npx tsc --init

## Start Setup typeorm
npx typeorm init --database sqlite3

## Create migrations
yarn typeorm migration:create src/infra/database/migrations/createUsers

## Run migrations
yarn typeorm migration:run --d src/data-source

## Drop Last Table
yarn typeorm migration:revert --d src/data-source
```
