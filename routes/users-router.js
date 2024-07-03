const { getUsers, getUserById } = require("../controllers/users.controller");

const usersRouter = require("express").Router();

usersRouter.get("/",getUsers);

usersRouter.get("/:username",getUserById);


module.exports = usersRouter;
