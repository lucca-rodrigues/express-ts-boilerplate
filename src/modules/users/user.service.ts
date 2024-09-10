import { Request, Response } from "express";
import IContractUseCases from "infra/contracts";
import { UserDto } from "modules/users/dto/user.dto";

export default class UserServices {
  private userUseCases: IContractUseCases<UserDto>;

  constructor(userUseCases: IContractUseCases<UserDto>) {
    this.userUseCases = userUseCases;
  }

  async getAll(req: Request, res: Response) {
    const response = await this.userUseCases.getAll(req?.query);
    return res.json(response);
  }

  async getOne(req: Request, res: Response) {
    const response = await this.userUseCases.getOne(req?.params?.id);
    return res.json(response);
  }

  async create(req: Request, res: Response) {
    const data = req.body as UserDto;
    const response = await this.userUseCases.create(data);
    return res.json(response);
  }

  async update(req: Request, res: Response) {
    const data = req.body as UserDto;
    const userId = req.params.id;
    const response = await this.userUseCases.update(userId, data);
    return res.status(200).json(response);
  }

  async delete(req: Request, res: Response) {
    const response = await this.userUseCases.delete(req?.params?.id);
    return res.status(204).json(response);
  }
}
