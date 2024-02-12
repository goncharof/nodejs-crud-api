import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { db } from "../utils/database";

export interface INewUser {
  username: string;
  age: number;
  hobbies: string[];
}

// interface IUser extends INewUser {
//   id: string;
// }

const validateUser = (user: INewUser) => {
  if (!user.username) {
    throw new Error("Username is required");
  }
  if (!user.age || typeof user.age !== "number") {
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

    db.push({
      id: uuidv4(),
      ...user,
    });

    return {
      body: JSON.stringify(db[db.length - 1]),
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

    const user = db.find((u) => u.id === id);

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

    return db.find((user) => user.id === id);
  } catch (error) {
    return {
      body: JSON.stringify({ error: error.message }),
      status: 400,
    };
  }
};

const findAll = () => db;

const deleteById = (id: string) => {
  const index = db.findIndex((user) => user.id === id);
  if (index !== -1) {
    return db.splice(index, 1)[0];
  }
  throw new Error(`User with ID ${id} not found`);
};

export default { save, update, findById, findAll, deleteById };
