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
      `INSERT INTO comments (body, author, article_id)
     VALUES ($1, $2, $3)
     RETURNING *;`,
      [body.body, body.username, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function eraseCommentById(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1;`, [comment_id])
    .then(({ rowCount }) => {
      return rowCount;
    });
}

module.exports = {
  fetchCommentsByArticle,
  addCommentByArticle,
  eraseCommentById,
};
