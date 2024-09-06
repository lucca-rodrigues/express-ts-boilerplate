export interface ICustomerUseCases {
  getAll(query?: any): Promise<any>;
  getOne(id: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
}
