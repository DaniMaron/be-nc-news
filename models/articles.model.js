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

  const dbQueryStart = `SELECT articles.article_id, articles.title, 
  articles.author,articles.topic, articles.created_at,
  articles.votes, articles.article_img_url,
  COUNT(comments.body) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id 
  `;

  let dbQueryMiddle1 = "";

  const dbQueryMiddle2 = ` GROUP BY articles.article_id`;
  let dbQueryEnd1 = ` ORDER BY articles.created_at`;
  let dbQueryEnd2 = ` DESC`;

  let values = [];
  const queriesKeys = Object.keys(queries);
  if (queriesKeys.length > 0) {
    for (let i = 0; i < queriesKeys.length; i++) {
      if (acceptableFilteringQueries.includes(queriesKeys[i])) {
        if (i === 0) dbQueryMiddle1 += ` WHERE articles.${queriesKeys[i]} = $1`;
        else dbQueryMiddle1 += ` AND articles.${queriesKeys[i]} = $${i + 1}`;
        values.push(queries[queriesKeys[i]]);
      } else if (acceptableSortingQueries.includes(queriesKeys[i])) {
        if (queriesKeys[i] === "sort_by") {
          dbQueryEnd1 = ` ORDER BY articles.${queries[queriesKeys[i]]}`;
        } else {
          dbQueryEnd2 = ` ${queries[queriesKeys[i]]}`;
        }
      } else {
        dbQueryMiddle1 += ` WHERE articles.invalid_column_name = 'mitch'`;
      }
    }
  }

  const queryString =
    dbQueryStart + dbQueryMiddle1 + dbQueryMiddle2 + dbQueryEnd1 + dbQueryEnd2;

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

module.exports = { fetchArticleById, fetchArticles, updateArticleById };
