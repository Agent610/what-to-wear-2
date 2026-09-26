const User = require("../models/user");
const {
  SUCCESS,
  CREATE,
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
} = require("../utils/errors");

//GET/ users

const getUsers = (req, res) => {
  User.find({})
    .then((users) =>
      res.status(SUCCESS).send({ message: "User was found", users })
    )
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

//POST / creating a user

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(CREATE).send(user))
    .create((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Bad request user not found" });
      }
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESS).send({ message: "Get user", user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError")
        return res.status(BAD_REQUEST).send({ message: "Bad request" });
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

module.exports = { getUsers, createUser, getUser };
