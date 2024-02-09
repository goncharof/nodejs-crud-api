import User from "../models/user";

function create(req, res) {
  const { username, age, hobbies } = req.body;
  if (!username || !age) {
    return res.status(400).send("Username and age are required.");
  }

  try {
    const newUser = User.save({ username, age, hobbies });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

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

const list = () => {
  return new Promise((resolve, reject) => {
    reject({ message: "Internal server error", status: 500 });
    // try {
    //   resolve(User.findAll());
    // } catch {
    //   reject({ message: "Internal server error", status: 500 });
    // }
  });
};

export { create, getById, update, remove, list };
