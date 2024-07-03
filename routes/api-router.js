const express = require("express");
const apiRouter = express.Router();

const getEndpoints = require("../controllers/endPoints.controller");

const articlesRouter = require("./articles-router");
const commentsRouter = require("./comments-router");
const usersRouter = require("./users-router");
const topicsRouter = require("./topics-router");

apiRouter.get("/", getEndpoints);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

apiRouter.use("/topics", topicsRouter);

// apiRouter.delete('/articles/:article_id', deleteArticleById)

module.exports = apiRouter;
