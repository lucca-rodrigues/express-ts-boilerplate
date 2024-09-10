/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import UserServices from "./user.service";
import IContractUseCases from "infra/contracts";
import { UserDto } from "modules/users/dto/user.dto";
let faker: any;

describe("UserServices", () => {
  let userServices: UserServices;
  let mockUserUseCases: Partial<IContractUseCases<UserDto>>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeAll(async () => {
    faker = await import("@faker-js/faker");
  });

  beforeEach(() => {
    mockUserUseCases = {
      getAll: jest.fn(),
      getOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    userServices = new UserServices(
      mockUserUseCases as IContractUseCases<UserDto>
    );
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("should get all users", async () => {
    const users = [
      { id: "generated-uuid", name: faker.faker.person.fullName() },
    ];
    mockRequest.query = {};
    mockUserUseCases.getAll = jest.fn().mockResolvedValue(users);

    await userServices.getAll(mockRequest as Request, mockResponse as Response);

    expect(mockUserUseCases.getAll).toHaveBeenCalledWith(mockRequest.query);
    expect(mockResponse.json).toHaveBeenCalledWith(users);
  });

  it("should get one user", async () => {
    const userId = "generated-uuid";
    const user = { id: userId, name: faker.faker.person.fullName() };
    mockRequest.params = { id: userId };
    mockUserUseCases.getOne = jest.fn().mockResolvedValue(user);

    await userServices.getOne(mockRequest as Request, mockResponse as Response);

    expect(mockUserUseCases.getOne).toHaveBeenCalledWith(userId);
    expect(mockResponse.json).toHaveBeenCalledWith(user);
  });

  it("should create a user", async () => {
    const userData: UserDto = { name: faker.faker.person.fullName() };
    mockRequest.body = userData;
    mockUserUseCases.create = jest
      .fn()
      .mockResolvedValue({ id: "generated-uuid", ...userData });

    await userServices.create(mockRequest as Request, mockResponse as Response);

    expect(mockUserUseCases.create).toHaveBeenCalledWith(userData);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining(userData)
    );
  });

  it("should update a user", async () => {
    const userId = "generated-uuid";
    const userData: UserDto = { name: faker.faker.person.fullName() };
    mockRequest.params = { id: userId };
    mockRequest.body = userData;
    mockUserUseCases.update = jest
      .fn()
      .mockResolvedValue({ id: userId, ...userData });

    await userServices.update(mockRequest as Request, mockResponse as Response);

    expect(mockUserUseCases.update).toHaveBeenCalledWith(userId, userData);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ id: userId, ...userData });
  });

  it("should delete a user", async () => {
    const userId = "generated-uuid";
    mockRequest.params = { id: userId };
    mockUserUseCases.delete = jest.fn().mockResolvedValue(undefined);

    await userServices.delete(mockRequest as Request, mockResponse as Response);

    expect(mockUserUseCases.delete).toHaveBeenCalledWith(userId);
    expect(mockResponse.status).toHaveBeenCalledWith(204);
  });
});
