/* eslint-disable @typescript-eslint/no-explicit-any */
import app from "..";
import request from "supertest";
import { AppDataSource } from "../data-source";
import { faker } from "@faker-js/faker";

describe("User CRUD E2E", () => {
  let userId: string;

  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("should create a user", async () => {
    const userName = faker.person.fullName();
    const response = await request(app)
      .post("/api/users")
      .send({ name: userName });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(userName);
    userId = response.body.id;
  }, 10000);

  it("should get all users", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should get a user by id", async () => {
    const response = await request(app).get(`/api/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", userId);
  });

  it("should update a user", async () => {
    const updatedName = faker.person.fullName();
    const response = await request(app)
      .put(`/api/users/${userId}`)
      .send({ name: updatedName });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", updatedName);
  });

  it("should delete a user", async () => {
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).toBe(204);
  });
});
