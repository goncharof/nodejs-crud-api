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

  console.log(
    User.update(
      id,
      Object.fromEntries(
        Object.entries({ username, age, hobbies }).filter(
          ([, v]) => v !== undefined,
        ),
      ),
    ),
  );

  return User.update(
    id,
    Object.fromEntries(
      Object.entries({ username, age, hobbies }).filter(
        ([, v]) => v !== undefined,
      ),
    ),
  );
};

function getById(req, res) {
  const { id } = req.params;
  try {
    const user = User.findById(id);
    if (!user) {
      return res.status(404).send("User not found.");
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

function remove(req, res) {
  const { id } = req.params;
  try {
    const user = User.deleteById(id);
    return res.json(user);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export { create, getById, update, remove, list };
