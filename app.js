const express = require("express");
const getTopics = require("./controllers/topics.controller");
const getEndpoints = require("./controllers/endPoints.controller");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");
const {
  getCommentsByArticle,
  postCommentByArticle,
} = require("./controllers/comments.controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.post("/api/articles/:article_id/comments", postCommentByArticle);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Invalid input" });
      break;
    case "23502":
      res.status(400).send({ msg: "Bad request" });
      break;
    case "23503":
      res.status(400).send({ msg: "Bad request" });
      break;
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
