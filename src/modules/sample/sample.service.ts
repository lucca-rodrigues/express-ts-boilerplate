import { Request, Response } from "express";
import IContractUseCases from "infra/contracts";
import { SampleDto } from "modules/sample/dto/sample.dto";

export default class SampleService {
  private contractUseCases: IContractUseCases<SampleDto>;

  constructor(contractUseCases: IContractUseCases<SampleDto>) {
    this.contractUseCases = contractUseCases;
  }

  async getAll(req: Request, res: Response) {
    const response = await this.contractUseCases.getAll(req?.query);
    return res.json(response);
  }

  async getOne(req: Request, res: Response) {
    const response = await this.contractUseCases.getOne(req?.params?.id);
    return res.json(response);
  }

  async create(req: Request, res: Response) {
    const data = req.body as SampleDto;
    const response = await this.contractUseCases.create(data);
    return res.json(response);
  }

  async update(req: Request, res: Response) {
    const data = req.body as SampleDto;
    const userId = req.params.id;
    const response = await this.contractUseCases.update(userId, data);
    return res.json(response);
  }

  async delete(req: Request, res: Response) {
    const response = await this.contractUseCases.delete(req?.params?.id);
    return res.json(response);
  }
}