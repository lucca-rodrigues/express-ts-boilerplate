import {  } from "modules/sample/entity/sample.entity";
import { sampleRepository } from "infra/repository";
import IContractUseCases from "infra/contracts";
import { ErrorHandler } from "infra/errorHandlers";

export default class SampleUseCases implements IContractUseCases<> {
    constructor() {}

    async getAll(query = {}): Promise<> {
        try {
            const response = await sampleRepository.find();
            return response;
        } catch (error: unknown) {
            throw ErrorHandler.InternalServerError(error);
        }
    }

    async getOne(id: string): Promise< | void> {
        try {
            const response = await sampleRepository.findOneBy({ id });
            if (!response) {
                throw ErrorHandler.NotFound(" not found");
            }
            return response as ;
        } catch (error: unknown) {
            throw ErrorHandler.InternalServerError(error);
        }
    }

    async create(data: Partial<>): Promise<> {
        try {
            const response = await sampleRepository.save(data);
            return response;
        } catch (error: unknown) {
            throw ErrorHandler.InternalServerError(error);
        }
    }

    async update(id: string, data: Partial<>): Promise< | void> {
        try {
            const entity = await this.getOne(id);
            if (!entity) {
                throw ErrorHandler.NotFound(" not found");
            }
            await sampleRepository.update(id, data);
            return { ...entity, ...data };
        } catch (error: unknown) {
            throw ErrorHandler.InternalServerError(error);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const entity = await this.getOne(id);
            if (!entity) {
                throw ErrorHandler.NotFound(" not found");
            }
            await sampleRepository.delete(id);
        } catch (error: unknown) {
            throw ErrorHandler.InternalServerError(error);
        }
    }
}