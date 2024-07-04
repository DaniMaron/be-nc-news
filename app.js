const cors = require("cors");
const express = require("express");
const apiRouter = require("./routes/api-router");

const {
  handlePsqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/index.js");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
