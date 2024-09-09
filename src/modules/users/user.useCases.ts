import { httpRequest } from "infra";
import { Repository, getRepository } from "typeorm";
import { User } from "./entity/User.entity";
import { userRepository } from "infra/repository";

export default class UserUseCases {
  constructor() {}

  // async getAll(query = {}) {
  //   const queryString = new URLSearchParams(query).toString();
  //   const response = await httpRequest.get(`/external-api?${queryString}`);
  //   return response;
  // }

  async getAll(query = {}) {
    const response = await userRepository.find();
    return response;
  }

  async getOne(id: string) {
    const response = await httpRequest.get(`/customers/${id}`);
    return response;
  }

  async create(data: any) {
    const response = await httpRequest.post("/customers", data);
    return response;
  }

  async update(id: string, data: any) {
    const response = await httpRequest.put(`/customers/${id}`, data);
    return response;
  }

  async delete(id: string) {
    const response = await httpRequest.delete(`/customers/${id}`);
    return response;
  }
}
