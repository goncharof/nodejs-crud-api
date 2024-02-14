// test get route using supertest library
import { v4 as uuidv4 } from "uuid";
import supertest from "supertest";
import { server } from "../src/server";
import { INewUser } from "../src/models/user";

describe("some tests for API (not less than 3 scenarios)", () => {
  const app = server().listen();
  const request = supertest(app);

  const newUser: INewUser = {
    username: "John Doe",
    age: 18,
    hobbies: ["nodejs"],
  };

  let response: supertest.Response;

  afterAll((done) => {
    app.close(done);
  });

  test("create and delete user, try to create user without required data", async () => {
    response = await request.get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    response = await request.post("/api/users").send(newUser);
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

    response = await request.post("/api/users").send({ name: "John Doe" });
    expect(response.status).toBe(400);
  });

  test("create update and update with invalid data", async () => {
    response = await request.post("/api/users").send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    const id = response.body.id;
    const validData = {
      username: "Doe Jhon",
      age: 64,
      hobbies: ["rs-school", "nodejs"],
    };

    response = await request.put(`/api/users/${id}`).send(validData);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id, ...validData });

    const invalidDataSets = [
      {
        username: "Doe Jhon",
        age: 64,
        hobbies: [1, 2, 3], //invalid
      },
      {
        username: "Doe Jhon",
        age: -75, //invalid
        hobbies: ["rs-school", "nodejs"],
      },
      {
        username: "", //invalid
        age: 64,
        hobbies: ["rs-school", "nodejs"],
      },
    ];

    for (const invalidData of invalidDataSets) {
      response = await request.put(`/api/users/${id}`).send(invalidData);
      expect(response.status).toBe(400);
    }
  });

  test('code 400 - get put and delete with invalid "id"', async () => {
    const invalidId = "1234";

    response = await request.get(`/api/users/${invalidId}`);
    expect(response.status).toBe(400);

    response = await request.put(`/api/users/${invalidId}`).send(newUser);
    expect(response.status).toBe(400);

    response = await request.delete(`/api/users/${invalidId}`);
    expect(response.status).toBe(400);
  });

  test("code 404", async () => {
    const validId = uuidv4();

    response = await request.get(`/api/users/${validId}`);
    expect(response.status).toBe(404);
    response = await request.put(`/api/users/${validId}`).send(newUser);
    expect(response.status).toBe(404);
    response = await request.delete(`/api/users/${validId}`);
    expect(response.status).toBe(404);

    response = await request.get(`/api/some-unexpected-route`);
    expect(response.status).toBe(404);
  });
});
