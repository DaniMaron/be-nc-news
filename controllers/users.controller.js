const { fetchUsers, fetchUserById } = require("../models/users.model");

function getUsers(req, res, next) {
  fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
}

function getUserById(req, res, next) {
  fetchUserById(req.params.username)
    .then((user) => {
      res.status(200).send({ user: user });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getUsers, getUserById };
