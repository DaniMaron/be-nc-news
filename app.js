const express = require("express");
const getTopics = require("./controllers/topics.controller");
const getEndpoints = require("./controllers/endPoints.controller");
const getArticleById = require("./controllers/articles.controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  if (err.code === "22P02") res.status(400).send({ msg: "Invalid input" });
  else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "An error has occured" });
});

module.exports = app;
