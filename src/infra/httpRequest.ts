import axios, { AxiosInstance, AxiosResponse } from "axios";
import dotenv from "dotenv";

dotenv.config();

export default class HttpRequest {
  private baseUrl: string | undefined;
  private bearerToken: string | undefined;

  constructor() {
    this.baseUrl = process.env.GATEWAY_BASE_URL;
    this.bearerToken = process.env.API_TOKEN;
  }

  private api(): AxiosInstance {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${this.bearerToken}`,
      },
    });
  }

  async get<T>(path: string): Promise<T | undefined> {
    const response: AxiosResponse<T> = await this.api().get<T>(`${path}`);
    return response?.data;
  }

  async post<T, R>(path: string, data: T): Promise<R | undefined> {
    const response: AxiosResponse<R> = await this.api().post<R>(`${path}`, data);
    return response?.data;
  }

  async put<T, R>(path: string, data: T): Promise<R | undefined> {
    const response: AxiosResponse<R> = await this.api().put<R>(`${path}`, data);
    return response?.data;
  }

  async patch<T, R>(path: string, data: T): Promise<R | undefined> {
    const response: AxiosResponse<R> = await this.api().patch<R>(`${path}`, data);
    return response?.data;
  }

  async delete<R>(path: string): Promise<R | undefined> {
    const response: AxiosResponse<R> = await this.api().delete<R>(`${path}`);
    return response?.data;
  }
}
