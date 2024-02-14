import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { db } from "../utils/database";

export interface INewUser {
  username: string;
  age: number;
  hobbies: string[];
}

const validateUser = (user: INewUser) => {
  if (!user.username) {
    throw new Error("Username is required");
  }
  if (!user.age || typeof user.age !== "number" || user.age <= 0) {
    throw new Error("Age is required");
  }
  if (
    !user.hobbies ||
    !Array.isArray(user.hobbies) ||
    user.hobbies.some((hobby) => typeof hobby !== "string")
  ) {
    throw new Error("Hobbies are required");
  }
};

const validateId = (id: string) => {
  if (!uuidValidate(id)) {
    throw new Error("Invalid ID");
  }
};

const save = (user: INewUser) => {
  try {
    validateUser(user);

    let id = uuidv4();
    while (db.users.some((u) => u.id === id)) {
      id = uuidv4();
    }

    db.users.push({ id, ...user });

    return {
      body: JSON.stringify(db.users[db.users.length - 1]),
      status: 201,
    };
  } catch (error) {
    return {
      body: JSON.stringify({ error: error.message }),
      status: 400,
    };
  }
};

const update = (id: string, data: Partial<INewUser>) => {
  try {
    validateId(id);

    const user = db.users.find((u) => u.id === id);

    if (!user) {
      return {
        body: JSON.stringify({ error: "User not found" }),
        status: 404,
      };
    }

    validateUser({ ...user, ...data });

    return {
      body: JSON.stringify(Object.assign(user, data)),
      status: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify({ error: error.message }),
      status: 400,
    };
  }
};

const findById = (id: string) => {
  try {
    validateId(id);

    const user = db.users.find((user) => user.id === id);

    return user
      ? {
          body: JSON.stringify(user),
          status: 200,
        }
      : {
          body: JSON.stringify({ error: "User not found" }),
          status: 404,
        };
  } catch (error) {
    return {
      body: JSON.stringify({ error: error.message }),
      status: 400,
    };
  }
};

const findAll = () => db.users;

const deleteById = (id: string) => {
  try {
    validateId(id);

    const user = db.users.find((user) => user.id === id);

    if (user) {
      db.users.splice(db.users.indexOf(user), 1);
      return {
        status: 204,
      };
    }

    return {
      body: JSON.stringify({ error: "User not found" }),
      status: 404,
    };
  } catch (error) {
    return {
      body: JSON.stringify({ error: error.message }),
      status: 400,
    };
  }
};

export default { save, update, findById, findAll, deleteById };
