const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  SUCCESS,
  CREATE,
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  REGISTRATION_ERROR,
  ERROR,
  INCORRECT,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

//POST / creating a user

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) =>
      res.status(CREATE).send({
        _id: user._id,
        email: user.email,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.code === ERROR) {
        return res
          .status(REGISTRATION_ERROR)
          .send({ message: "Email is connected with another account" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Bad request user not found" });
      }
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user._id;
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

//login information
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Error: Email and password are not entered" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(SUCCESS).send({ token, message: "Login success" });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(INCORRECT)
          .send({ message: "Entered email or password is incorrect" });
      }
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

// Updating the user
const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Name or Avatar couldn't be updated try again later" });
  }
  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(SUCCESS).send({ user }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({
            message: "Name or Avatar couldn't be updated try again later",
          });
      }
      return res.status(DEFAULT).send({ message: "Default" });
    });
};

module.exports = { createUser, getCurrentUser, login, updateUser };
