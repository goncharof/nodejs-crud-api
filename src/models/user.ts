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

const save = (user: INewUser) => {
  db.push({
    id: uuidv4(),
    hobbies: [],
    ...user,
  });
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
