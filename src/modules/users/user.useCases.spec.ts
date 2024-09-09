import { userRepository } from "infra/repository";
import UserUseCases from "./user.useCases";

jest.mock("infra/repository");

describe("UserUseCases", () => {
  let userUseCases: UserUseCases;

  beforeEach(() => {
    userUseCases = new UserUseCases();
  });

  it("should be create a user and return it", async () => {
    const userData = { name: "sample" };
    const savedUser = { id: "uuid-generated", ...userData };
    (userRepository.save as jest.Mock).mockResolvedValue(savedUser);

    const result = await userUseCases.create(userData);

    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining(userData));
    expect(result).toEqual(savedUser);
  });

  it("should be return all created users", async () => {
    const users = [
      { id: "uuid-1", name: "user1" },
      { id: "uuid-2", name: "user2" },
    ];
    (userRepository.find as jest.Mock).mockResolvedValue(users);

    const result = await userUseCases.getAll();

    expect(userRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(users);
  });
});
