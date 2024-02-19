const express = require("express");
const getTopics = require("./controllers/topics.controller");
const getEndpoints = require("./controllers/endPoints.controller");
const app = express();

app.get('/api/topics', getTopics)
app.get('/api',getEndpoints)


app.use((err, req, res, next) => {
    console.log(err);
  res.status(500).send({ msg: "An error has occured" });
});

module.exports = app