import { CreateUsers1725904652345 } from "./migrations/1725904652345-createUsers";
import { QueryRunner } from "typeorm";

describe("CreateUsers Migration", () => {
  let mockQueryRunner: jest.Mocked<QueryRunner>;

  beforeEach(() => {
    mockQueryRunner = {
      createTable: jest.fn(),
      dropTable: jest.fn(),
    } as unknown as jest.Mocked<QueryRunner>;
  });

  it("should create the users table", async () => {
    const migration = new CreateUsers1725904652345();

    await migration.up(mockQueryRunner);

    expect(mockQueryRunner.createTable).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "users",
        columns: expect.arrayContaining([
          expect.objectContaining({ name: "id" }),
          expect.objectContaining({ name: "name" }),
        ]),
      })
    );
  });

  it("should drop the users table", async () => {
    const migration = new CreateUsers1725904652345();

    await migration.down(mockQueryRunner);

    expect(mockQueryRunner.dropTable).toHaveBeenCalledWith("users");
  });
});
