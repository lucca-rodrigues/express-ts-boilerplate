import { User } from "./entity/user.entity";
import { userRepository } from "infra/repository";
import IContractUseCases from "infra/contracts";
import { ErrorHandler } from "infra/errorHandlers";

export default class UserUseCases implements IContractUseCases<User> {
  constructor() {}

  async getAll(query = {}): Promise<User[]> {
    try {
      const response = await userRepository.find();
      return response;
    } catch (error: unknown) {
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async getOne(id: string): Promise<User> {
    try {
      const response = await userRepository.findOneBy({ id });
      if (!response) {
        throw ErrorHandler.NotFound("User not found");
      }
      return response;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "User not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async create(data: Partial<User>): Promise<User> {
    try {
      const response = await userRepository.save(data);
      return response;
    } catch (error: unknown) {
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      const user = await this.getOne(id);
      await userRepository.update(id, data);
      return { ...user, ...data };
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "User not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const user = await this.getOne(id);
      if (!user) {
        throw ErrorHandler.NotFound("User not found");
      }
      await userRepository.delete(id);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "User not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }
}
