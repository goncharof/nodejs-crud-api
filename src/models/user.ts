import { v4 as uuidv4 } from "uuid";
import { db } from "../utils/database";

interface INewUser {
  username: string;
  age: number;
  hobbies: string[];
}

interface IUser extends INewUser {
  id: string;
}

function validateUser(user: INewUser) {
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
}

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

const update = (user: IUser) => {
  const index = db.findIndex((u) => user.id === u.d);
  if (index !== -1) {
    db[index] = this;
    return this;
  }
  throw new Error(`User with ID ${user.id} not found`);
};

const findById = (id: string) => {
  return db.find((user) => user.id === id);
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
