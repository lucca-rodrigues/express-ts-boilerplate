export default interface IContractUseCases<T> {
  getAll(query?: any): Promise<any>;
  getOne(id: string): Promise<any>;
  create(data: T): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
}
