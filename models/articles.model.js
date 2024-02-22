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

  let dbQueryMiddle = "";

  const dbQueryEnd = `
    GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;`;

  let values = [];

  const queriesKeys = Object.keys(queries);
  if (queriesKeys.length > 0) {
    for (let i = 0; i < queriesKeys.length; i++) {
      if (acceptableFilteringQueries.includes(queriesKeys[i])) {
        if (i === 0) dbQueryMiddle += ` WHERE articles.${queriesKeys[i]} = $1`;
        else
          dbQueryMiddle += `
         AND articles.${queriesKeys[i]} = $2`;
        values.push(queries[queriesKeys[i]]);
      } else {
        dbQueryMiddle += ` WHERE articles.kdsljs = 'mitch'`;
      }
    }
  }

  return db
    .query(dbQueryStart + dbQueryMiddle + dbQueryEnd, values)
    .then(({ rows }) => {
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
