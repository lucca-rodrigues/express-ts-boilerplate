/* eslint-disable @typescript-eslint/no-explicit-any */
import { userRepository } from "infra/repository";
import UserUseCases from "modules/users/user.useCases";
import { ErrorHandler } from "infra/errorHandlers";
import { User } from "./entity/user.entity";

let fakerLib: any;

jest.mock("infra/repository");
jest.mock("infra/errorHandlers");

describe("UserUseCases", () => {
  let userUseCases: UserUseCases;
  let mockUser: User;

  beforeAll(async () => {
    fakerLib = await import("@faker-js/faker");
  });

  beforeEach(() => {
    userUseCases = new UserUseCases();
    mockUser = {
      id: fakerLib.faker.string.uuid(),
      name: fakerLib.faker.person.fullName(),
    } as User;
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all users", async () => {
      (userRepository.find as jest.Mock).mockResolvedValue([mockUser]);

      const result = await userUseCases.getAll();

      expect(result).toEqual([mockUser]);
      expect(userRepository.find).toHaveBeenCalled();
    });

    it("should throw an error if repository throws", async () => {
      const error = new Error("Database error");
      (userRepository.find as jest.Mock).mockRejectedValue(error);
      (ErrorHandler.InternalServerError as jest.Mock).mockReturnValue(error);

      await expect(userUseCases.getAll()).rejects.toThrow("Database error");
      expect(ErrorHandler.InternalServerError).toHaveBeenCalledWith(error);
    });
  });

  describe("getOne", () => {
    it("should return a user if found", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);

      const result = await userUseCases.getOne(mockUser.id);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        id: mockUser.id,
      });
    });

    it("should throw NotFound error if user not found", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const notFoundError = new Error("User not found");
      (ErrorHandler.NotFound as jest.Mock).mockReturnValue(notFoundError);

      await expect(
        userUseCases.getOne(fakerLib.faker.string.uuid())
      ).rejects.toThrow("User not found");
      expect(ErrorHandler.NotFound).toHaveBeenCalledWith("User not found");
    });
  });

  describe("create", () => {
    it("should create and return a new user", async () => {
      const newUserName = fakerLib.faker.person.fullName();
      (userRepository.save as jest.Mock).mockResolvedValue({
        ...mockUser,
        name: newUserName,
      });

      const result = await userUseCases.create({ name: newUserName });

      expect(result).toEqual({ ...mockUser, name: newUserName });
      expect(userRepository.save).toHaveBeenCalledWith({ name: newUserName });
    });

    it("should throw an error if creation fails", async () => {
      const error = new Error("Creation failed");
      (userRepository.save as jest.Mock).mockRejectedValue(error);
      (ErrorHandler.InternalServerError as jest.Mock).mockReturnValue(error);

      await expect(
        userUseCases.create({ name: fakerLib.faker.person.fullName() })
      ).rejects.toThrow("Creation failed");
      expect(ErrorHandler.InternalServerError).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should update and return the updated user", async () => {
      const updatedName = fakerLib.faker.person.fullName();
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });

      const result = await userUseCases.update(mockUser.id, {
        name: updatedName,
      });

      expect(result).toEqual({ ...mockUser, name: updatedName });
      expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
        name: updatedName,
      });
    });

    it("should throw NotFound error if user not found", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const notFoundError = new Error("User not found");
      (ErrorHandler.NotFound as jest.Mock).mockReturnValue(notFoundError);

      await expect(
        userUseCases.update(fakerLib.faker.string.uuid(), {
          name: fakerLib.faker.person.fullName(),
        })
      ).rejects.toThrow("User not found");
      expect(ErrorHandler.NotFound).toHaveBeenCalledWith("User not found");
    });
  });

  describe("delete", () => {
    it("should delete the user", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.delete as jest.Mock).mockResolvedValue({ affected: 1 });

      await userUseCases.delete(mockUser.id);

      expect(userRepository.delete).toHaveBeenCalledWith(mockUser.id);
    });

    it("should throw NotFound error if user not found", async () => {
      (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);
      const notFoundError = new Error("User not found");
      (ErrorHandler.NotFound as jest.Mock).mockReturnValue(notFoundError);

      await expect(
        userUseCases.delete(fakerLib.faker.string.uuid())
      ).rejects.toThrow("User not found");
      expect(ErrorHandler.NotFound).toHaveBeenCalledWith("User not found");
    });
  });
});
