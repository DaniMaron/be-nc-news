const { getArticles, getArticleById, patchArticleById, deleteArticleById } = require("../controllers/articles.controller");

const commentsRouter = require("./comments-router");

const articlesRouter = require("express").Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticleById);
// articlesRouter.delete("/:article_id", deleteArticleById);

articlesRouter.use("/:article_id/comments", commentsRouter);


module.exports = articlesRouter;
