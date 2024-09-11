/* eslint-disable @typescript-eslint/no-explicit-any */
import { userRepository } from "infra/repository";
import UserUseCases from "modules/users/user.useCases";
let fakerLib: any;

jest.mock("infra/repository");

describe("UserUseCases", () => {
  let userUseCases: UserUseCases;

  beforeEach(async () => {
    userUseCases = new UserUseCases();
    fakerLib = await import("@faker-js/faker");
  });

  it("should create a user and return it", async () => {
    const userData = { name: fakerLib.faker.person.fullName() };
    const savedUser = { id: "uuid-generated", ...userData };
    (userRepository.save as jest.Mock).mockResolvedValue(savedUser);

    const result = await userUseCases.create(userData);

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining(userData)
    );
    expect(result).toEqual(savedUser);
  });

  it("should return all created users", async () => {
    const users = [
      { id: "generated-uuid", name: fakerLib.faker.person.fullName() },
      { id: "generated-uuid-2", name: fakerLib.faker.person.fullName() },
    ];
    (userRepository.find as jest.Mock).mockResolvedValue(users);

    const result = await userUseCases.getAll();

    expect(userRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });

  it("should return a user by id", async () => {
    const userId = "existing-uuid";
    const user = { id: userId, name: fakerLib.faker.person.fullName() };
    (userRepository.findOneBy as jest.Mock).mockResolvedValue(user);

    const result = await userUseCases.getOne(userId);

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    expect(result).toEqual(user);
  });

  it("should throw an error if user not found", async () => {
    const userId = "non-existing-uuid";
    (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(userUseCases.getOne(userId)).rejects.toThrow("User not found");
  });

  it("should update a user and return the updated user", async () => {
    const userId = "existing-uuid";
    const userData = { name: fakerLib.faker.person.fullName() };
    const existingUser = { id: userId, name: "Old Name" };
    const updatedUser = { ...existingUser, ...userData };

    (userRepository.findOneBy as jest.Mock).mockResolvedValue(existingUser);
    (userRepository.update as jest.Mock).mockResolvedValue(updatedUser);

    const result = await userUseCases.update(userId, userData);

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    expect(userRepository.update).toHaveBeenCalledWith(userId, userData);
    expect(result).toEqual(updatedUser);
  });

  it("should throw an error if trying to update a non-existing user", async () => {
    const userId = "non-existing-uuid";
    const userData = { name: fakerLib.faker.person.fullName() };
    (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(userUseCases.update(userId, userData)).rejects.toThrow(
      "User not found"
    );
  });

  it("should delete a user", async () => {
    const userId = "existing-uuid";
    const existingUser = { id: userId, name: fakerLib.faker.person.fullName() };
    (userRepository.findOneBy as jest.Mock).mockResolvedValue(existingUser);

    await userUseCases.delete(userId);

    expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: userId });
    expect(userRepository.delete).toHaveBeenCalledWith(userId);
  });

  it("should throw an error if trying to delete a non-existing user", async () => {
    const userId = "non-existing-uuid";
    (userRepository.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(userUseCases.delete(userId)).rejects.toThrow("User not found");
  });
});
