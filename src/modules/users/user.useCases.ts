import { User } from "./entity/user.entity";
import { userRepository } from "infra/repository";
import IContractUseCases from "infra/contracts";
import { ErrorHandler } from "infra/errorHandlers";

export default class UserUseCases implements IContractUseCases<User> {
  constructor() {}

  async getAll(): Promise<User[]> {
    try {
      return await userRepository.find();
    } catch (error: unknown) {
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async getOne(id: string): Promise<User> {
    try {
      const user = await userRepository.findOneBy({ id });
      if (!user) {
        throw ErrorHandler.NotFound("User not found");
      }
      return user;
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "User not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async create(data: Partial<User>): Promise<User> {
    try {
      return await userRepository.save(data);
    } catch (error: unknown) {
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    try {
      await this.getOne(id);
      await userRepository.update(id, data);
      return await this.getOne(id);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "User not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.getOne(id);
      await userRepository.delete(id);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "User not found") {
        throw error;
      }
      throw ErrorHandler.InternalServerError(error);
    }
  }
}
