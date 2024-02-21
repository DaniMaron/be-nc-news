const { fetchArticleById } = require("../models/articles.model");
const {
  fetchCommentsByArticle,
  addCommentByArticle,
} = require("../models/comments.model");

function getCommentsByArticle(req, res, next) {
  const comments = fetchCommentsByArticle(req.params.article_id);
  const articles = fetchArticleById(req.params.article_id);
  const promises = [comments, articles];
  Promise.all(promises)
    .then((result) => {
      if (result[0].length === 0) {
        res.status(200).send({ msg: "No comments found" });
      } else {
        res.status(200).send(result[0]);
      }
    })
    .catch(next);
}

function postCommentByArticle(req, res, next) {
  addCommentByArticle(req.params.article_id, req.body)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getCommentsByArticle, postCommentByArticle };
