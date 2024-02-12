import { IncomingMessage } from "node:http";
import User, { INewUser } from "../models/user";

const readBody = (req: IncomingMessage): Promise<INewUser> => {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      resolve(JSON.parse(body));
    });
  });
};

const list = () => ({ body: JSON.stringify(User.findAll()), status: 200 });

const create = async (
  req: IncomingMessage,
): Promise<{ body: string; status: number }> => {
  return new Promise(async (resolve) => {
    const { username, age, hobbies } = await readBody(req);

    resolve(User.save({ username, age, hobbies }));
  });
};

const update = async (id: string, req: IncomingMessage) => {
  const { username, age, hobbies } = await readBody(req);

  return User.update(
    id,
    Object.fromEntries(
      Object.entries({ username, age, hobbies }).filter(
        ([, v]) => v !== undefined,
      ),
    ),
  );
};

function getById(id: string) {
  return User.findById(id);
}

function remove(id: string) {
  return User.deleteById(id);
}

export { create, getById, update, remove, list };
