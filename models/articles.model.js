const fs = require("fs/promises");
const path = require("path");
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
    GROUP BY articles.article_id`,
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
  const endpointsPath = path.join(__dirname, "../endpoints.json");
  return fs
    .readFile(endpointsPath, "utf8")
    .then((endpointsFile) => {
      const endpoints = JSON.parse(endpointsFile);

      const filteringQueries = endpoints["GET /api/articles"].filteringQueries;
      const sortingQueries = endpoints["GET /api/articles"].sortingQueries;
      const directionQueries = ["ASC", "DESC"];

      const dbQueryStart = `
        SELECT articles.article_id, articles.title, 
        articles.author, articles.topic, articles.created_at,
        articles.votes, articles.article_img_url,
        COUNT(comments.body) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id 
      `;

      let dbQueryWhere = "";
      const dbQueryGroupBy = " GROUP BY articles.article_id";
      let dbQueryOrderBy = " ORDER BY articles.created_at";
      let dbQueryDirection = " DESC";

      const values = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(queries)) {
        if (filteringQueries.includes(key)) {
          const condition = Array.isArray(value)
            ? value
                .map((_) => `articles.${key} = $${paramIndex++}`)
                .join(" OR ")
            : `articles.${key} = $${paramIndex++}`;

          dbQueryWhere += dbQueryWhere.includes("WHERE")
            ? ` AND (${condition})`
            : ` WHERE (${condition})`;

          values.push(...(Array.isArray(value) ? value : [value]));
        } else if (key === "sort_by" && sortingQueries.includes(value)) {
          dbQueryOrderBy = ` ORDER BY ${
            value === "comment_count" ? "comment_count" : `articles.${value}`
          }`;
        } else if (
          key === "order" &&
          directionQueries.includes(value.toUpperCase())
        ) {
          dbQueryDirection = ` ${value.toUpperCase()}`;
        } else {
          return Promise.reject({ status: 400, msg: "Bad request" });
        }
      }

      const queryString =
        dbQueryStart +
        dbQueryWhere +
        dbQueryGroupBy +
        dbQueryOrderBy +
        dbQueryDirection;

      console.log(queryString);
      return db.query(queryString, values);
    })
    .then(({ rows }) => rows);
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
