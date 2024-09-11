import HttpRequest from "./httpRequest";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("HttpRequest", () => {
  let httpRequest: HttpRequest;

  beforeEach(() => {
    httpRequest = new HttpRequest("https://api.example.com");
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  it("should make a GET request", async () => {
    const mockData = { id: 1, name: "Test" };
    mockedAxios.get.mockResolvedValue({ data: mockData });

    const result = await httpRequest.get("/test");

    expect(result).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalledWith("/test");
  });

  it("should make a POST request", async () => {
    const postData = { name: "New Test" };
    const mockResponse = { id: 2, ...postData };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const result = await httpRequest.post("/test", postData);

    expect(result).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith("/test", postData);
  });

  it("should make a PUT request", async () => {
    const putData = { id: 1, name: "Updated Test" };
    mockedAxios.put.mockResolvedValue({ data: putData });

    const result = await httpRequest.put("/test/1", putData);

    expect(result).toEqual(putData);
    expect(mockedAxios.put).toHaveBeenCalledWith("/test/1", putData);
  });

  it("should make a PATCH request", async () => {
    const patchData = { name: "Patched Test" };
    const mockResponse = { id: 1, ...patchData };
    mockedAxios.patch.mockResolvedValue({ data: mockResponse });

    const result = await httpRequest.patch("/test/1", patchData);

    expect(result).toEqual(mockResponse);
    expect(mockedAxios.patch).toHaveBeenCalledWith("/test/1", patchData);
  });

  it("should make a DELETE request", async () => {
    mockedAxios.delete.mockResolvedValue({ data: { success: true } });

    const result = await httpRequest.delete("/test/1");

    expect(result).toEqual({ success: true });
    expect(mockedAxios.delete).toHaveBeenCalledWith("/test/1");
  });
});
