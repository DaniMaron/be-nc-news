const { fetchArticleById, fetchArticles } = require("../models/articles.model");

function getArticleById(req, res, next) {
  fetchArticleById(req.params.article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(req, res, next) {
  fetchArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = { getArticleById, getArticles };