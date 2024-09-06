import { Request, Response } from "express";
import { ICustomerUseCases } from "modules/customers/interfaces";
import { CreateCustomerDto } from "modules/customers/dto/createCustomer.dto";

export default class CustomerServices {
  private customerUseCases: ICustomerUseCases;

  constructor(customerUseCases: ICustomerUseCases) {
    this.customerUseCases = customerUseCases;
  }

  async getAll(req: Request, res: Response) {
    const response = await this.customerUseCases.getAll(req?.query);
    return res.json(response);
  }

  async getOne(req: Request, res: Response) {
    const response = await this.customerUseCases.getOne(req?.params?.id);
    return res.json(response);
  }

  async create(req: Request, res: Response) {
    const data = req.body as CreateCustomerDto;
    const response = await this.customerUseCases.create(data);
    return res.json(response);
  }
  async update(req: Request, res: Response) {
    const data = req.body as CreateCustomerDto;
    const customerId = req.params.id;
    const response = await this.customerUseCases.update(customerId, data);
    return res.json(response);
  }

  async delete(req: Request, res: Response) {
    const response = await this.customerUseCases.delete(req?.params?.id);
    return res.json(response);
  }
}
