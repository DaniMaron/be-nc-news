const db = require("../db/connection");

function fetchArticleById(id) {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.body, 
    articles.author,articles.topic, articles.created_at,
    articles.votes, articles.article_img_url,
    COUNT(comments.body) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
    `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows;
    });
}
function fetchArticles(queries) {
  const acceptableFilteringQueries = ["topic", "author"];
  const acceptableSortingQueries = ["sort_by", "order"];

  const dbQueryStart = `
    SELECT articles.article_id, articles.title, 
    articles.author, articles.topic, articles.created_at,
    articles.votes, articles.article_img_url,
    COUNT(comments.body) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id 
  `;

  let dbQueryMiddle = ``;
  const dbQueryGroupBy = ` GROUP BY articles.article_id`;
  let dbQuerySortBy = ` ORDER BY articles.created_at`;
  let dbQueryOrder = ` DESC`;

  let values = [];
  let paramIndex = 1;

  const queriesKeys = Object.keys(queries);

  if (queriesKeys.length > 0) {
    for (const key of queriesKeys) {
      if (acceptableFilteringQueries.includes(key)) {
        if (!dbQueryMiddle.includes("WHERE")) {
          dbQueryMiddle += ` WHERE articles.${key} = $${paramIndex}`;
        } else {
          dbQueryMiddle += ` AND articles.${key} = $${paramIndex}`;
        }
        values.push(queries[key]);
        paramIndex++;
      } else if (acceptableSortingQueries.includes(key)) {
        if (key === "sort_by") {
          const sortByField =
            queries[key] === "comment_count"
              ? "comment_count"
              : `articles.${queries[key]}`;
          dbQuerySortBy = ` ORDER BY ${sortByField}`;
        } else {
          dbQueryOrder = ` ${queries[key]}`;
        }
      } else {
        dbQueryMiddle += ` WHERE articles.invalid_column_name = 'invalid_value'`;
      }
    }
  }
  const queryString =
    dbQueryStart +
    dbQueryMiddle +
    dbQueryGroupBy +
    dbQuerySortBy +
    dbQueryOrder;


  return db.query(queryString, values).then(({ rows }) => {
    return rows;
  });
}

function updateArticleById(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

function eraseArticleById(article_id) {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rowCount }) => {
      return rowCount;
    });
}

module.exports = {
  fetchArticleById,
  fetchArticles,
  updateArticleById,
  eraseArticleById,
};
