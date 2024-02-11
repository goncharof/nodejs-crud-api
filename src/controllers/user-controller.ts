import { IncomingMessage } from "node:http";
import User from "../models/user";

const list = () => ({ body: JSON.stringify(User.findAll()), status: 200 });
const create = async (
  req: IncomingMessage,
): Promise<{ body: string; status: number }> => {
  return new Promise(async (resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { username, age, hobbies } = JSON.parse(body);

      resolve(User.save({ username, age, hobbies }));
    });
  });
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

function update(req, res) {
  const { id } = req.params;
  const { username, age, hobbies } = req.body;

  try {
    let user = User.findById(id);
    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.username = username || user.username;
    user.age = age || user.age;
    user.hobbies = hobbies || user.hobbies;

    user = user.update();
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
