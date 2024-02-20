const fetchArticleById = require("../models/articles.model");

function getArticleById(req, res, next) {
  fetchArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch(next);
}

module.exports = getArticleById;
