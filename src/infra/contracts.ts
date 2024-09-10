export default interface IContractUseCases<T> {
  getAll(query?: Partial<T>): Promise<T[]>;
  getOne(id: string): Promise<T | void>;
  create(data: T): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | void>;
  delete(id: string): Promise<void>;
}
