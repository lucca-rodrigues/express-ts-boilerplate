import { MigrationInterface, QueryRunner, Table } from "typeorm";

class MockQueryRunner implements Partial<QueryRunner> {
  createTable = jest.fn();
  dropTable = jest.fn();
}

describe("Migration Tests", () => {
  let queryRunner: MockQueryRunner;

  beforeEach(() => {
    queryRunner = new MockQueryRunner();
  });

  it("should create and drop a migration", async () => {
    const migration: MigrationInterface = {
      name: "TestMigration1234567890",
      async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: "test_table",
            columns: [
              {
                name: "id",
                type: "uuid",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "uuid",
              },
              {
                name: "name",
                type: "varchar",
                isNullable: false,
              },
            ],
          })
        );
      },
      async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("test_table");
      },
    };

    // Execute the migration
    await migration.up(queryRunner as unknown as QueryRunner);
    expect(queryRunner.createTable).toHaveBeenCalled();

    // Revert the migration
    await migration.down(queryRunner as unknown as QueryRunner);
    expect(queryRunner.dropTable).toHaveBeenCalledWith("test_table");
  });
});
