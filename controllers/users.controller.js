const { fetchUsers } = require("../models/users.model");

function getUsers(req, res, next) {
  fetchUsers().then((users) => {
    res.status(200).send({ users: users });
  });
}

module.exports = { getUsers };
