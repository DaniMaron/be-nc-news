const handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

const handlePsqlErrors = (err, req, res, next) => {
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
    case "42601":
      res.status(404).send({ msg: "Not found" });
      break;
    case "42703":
      res.status(400).send({ msg: "Bad request" });
      break;
    default:
      next(err);
  }
};

const handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};

module.exports = {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
};
