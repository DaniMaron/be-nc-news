const express = require("express");
const getTopics = require("./controllers/topics.controller");
const app = express();

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "An error has occured" });
});

module.exports = app