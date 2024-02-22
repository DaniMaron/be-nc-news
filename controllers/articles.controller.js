const {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
} = require("../models/articles.model");

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
      next(err);
    });
}

function patchArticleById(req, res, next) {
  updateArticleById(req.params.article_id, req.body.inc_votes)
    .then((article) => {
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: `Not found` });

      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById, getArticles, patchArticleById };
