const db = require("../db/connection");

function fetchCommentsByArticle(article_id) {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function addCommentByArticle(article_id, body) {
  return db
    .query(
      `INSERT INTO comments (body, author, created_at, article_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *;`,
      [body.body, body.username, body.created_at, article_id]
    )
    .then((data) => {
      return data.rows;
    });
}

module.exports = { fetchCommentsByArticle, addCommentByArticle };
