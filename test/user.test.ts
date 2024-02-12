// test get route using supertest library
import supertest from "supertest";
import { server } from "../src/server";

describe("some tests for API (not less than 3 scenarios)", () => {
  const app = server().listen();
  const request = supertest(app);

  afterAll((done) => {
    app.close(done);
  });

  test("create and delete user", async () => {
    let response = await request.get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    response = await request
      .post("/api/users")
      .send({ username: "Jhon Doe", age: 18, hobbies: ["nodejs"] });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    response = await request.get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);

    response = await request.delete(`/api/users/${response.body[0].id}`);
    expect(response.status).toBe(204);

    response = await request.get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });
});
