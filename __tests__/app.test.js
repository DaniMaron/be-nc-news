const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db//connection");
const fs = require("fs/promises");
const path = require("path");
const endpointsPath = path.join(__dirname, "../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  test("Status-200: responds with an array containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        expect(Array.isArray(topics)).toBe(true);
        expect(topics[0]).toMatchObject({
          slug: "mitch",
          description: "The man, the Mitch, the legend",
        });
      });
  });
  test("Status 400: responds with an error message when wrong endpoint is inserted", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ text }) => {
        text = JSON.parse(text);
        expect(text.msg).toBe("Not found");
      });
  });
});

describe("GET /api", () => {
  test("Status-200: responds with an object containing all endpoints", () => {
    return fs.readFile(endpointsPath, "utf8").then((data) => {
      data = JSON.parse(data);
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(typeof endpoints).toBe("object");
          expect(endpoints).toEqual(data);
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("Status-200: responds with an object containing the selected article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(typeof article[0]).toBe("object");

        expect(article[0]).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          author: "icellusedkars",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Status-200: responds with an object containing the selected article that has a property of comment_count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(typeof article[0]).toBe("object");

        expect(article[0]).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          author: "icellusedkars",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: "2",
        });
      });
  });
  test("Status 404: responds with an appropriate error when given an article Id that does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("Status 400: responds with an appropriate error when given an article Id that is invalid", () => {
    return request(app)
      .get("/api/articles/forklift")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles", () => {
  test("Status-200: responds with an array containing all articles ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);

        expect(articles[0]).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          author: "icellusedkars",
          article_id: 3,
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
        expect(articles.body).toBe(undefined);

        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Status 200: responds with an array of articles each containing a comment_count key with the total value of comments for said article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles[0].comment_count).toBe("2");
        expect(articles[1].comment_count).toBe("1");
        expect(articles[12].comment_count).toBe("0");
        expect(articles[6].comment_count).toBe("11");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Status-200: responds with an array containing all comments for a given article ordered by most recent comment first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body[1]).toMatchObject({
          comment_id: 2,
          votes: 14,
          created_at: "2020-10-31T03:03:00.000Z",
          author: "butter_bridge",
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          article_id: 1,
        });

        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Status 404: responds with an appropriate error when given an article Id that does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("Status 400: responds with an appropriate error when given an article Id that is invalid", () => {
    return request(app)
      .get("/api/articles/forklift/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
  test("Status 200: responds with an empty array when an article exists but there are no comments associated with it", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toEqual("No comments found");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Status-201: responds with an object containing the newly posted comment and adds it to the comments table", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Lovely article!",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(typeof comment[0]).toBe("object");
        expect(comment[0]).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: expect.any(String),
          author: "icellusedkars",
          body: "Lovely article!",
          article_id: 2,
        });

        return db
          .query(`SELECT * FROM comments WHERE comment_id = 19`)
          .then(({ rows }) => {
            expect(rows[0]).toMatchObject({
              comment_id: 19,
              votes: 0,
              author: "icellusedkars",
              body: "Lovely article!",
              article_id: 2,
            });
          });
      });
  });
  test("Status 400: responds with an appropriate status and error message when provided with a bad comment (no username)", () => {
    const newComment = { body: "Lovely article!", created_at: new Date() };

    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("Status 400: responds with an appropriate status and error message when provided with a bad comment (user not registered in database)", () => {
    const newComment = {
      username: "johnny",
      body: "Lovely article!",
      created_at: new Date(),
    };

    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("Status 400: responds with an appropriate error when given an article Id that does not exist", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Lovely article!",
      created_at: new Date(),
    };
    return request(app)
      .post("/api/articles/999999/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 400: responds with an appropriate error when given an article Id that is invalid", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Lovely article!",
      created_at: new Date(),
    };
    return request(app)
      .post("/api/articles/forklift/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Status 200: responds with the updated object", () => {
    const update = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(typeof article[0]).toBe("object");
        expect(article[0]).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          author: "icellusedkars",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 1,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("Status 400: responds with an appropriate error when provided with an object that doesn't have the inc_votes key", () => {
    const update = { hello: 1 };
    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 400: responds with an appropriate error when provided with an object that doesn't have the correct value", () => {
    const update = { inc_votes: "hi" };
    return request(app)
      .patch("/api/articles/3")
      .send(update)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });

  test("Status 404: responds with an appropriate error when article does not exist", () => {
    const update = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/999999")
      .send(update)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("Status 400: responds with an appropriate error when given an article Id that is invalid", () => {
    return request(app)
      .patch("/api/articles/forklift")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("Status 204: succesfully deletes comment with given comment_id", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(() => {
        db.query(`SELECT * FROM comments WHERE comment_id = 3;`).then(
          ({ rows }) => {
            expect(rows).toEqual([]);
          }
        );
      });
  });
  test("Status 404: comment does not exist", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  test("Status 400: comment_id is not a valid integer", () => {
    return request(app)
      .delete("/api/comments/forklift")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/users", () => {
  test("Status 200: responds with an array containing all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
        expect(users[0]).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
});

describe("GET /api/articles?:filteringquery=:value", () => {
  test("Status 200: responds with an array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
  test("Status 200: responds with an array of articles filtered by author", () => {
    return request(app)
      .get("/api/articles?author=rogersop")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(3);
        articles.forEach((article) => {
          expect(article.author).toBe("rogersop");
        });
      });
  });
  test("Status 200: responds with an array of articles filtered by both topic and author", () => {
    return (
      request(app)
        .get("/api/articles?author=rogersop&topic=mitch")
        // .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(2);
          articles.forEach((article) => {
            expect(article.author).toBe("rogersop");
            expect(article.topic).toBe("mitch");
          });
        })
    );
  });
  test("Status 200: responds with an array of articles filtered by both author and topic", () => {
    return (
      request(app)
        .get("/api/articles?topic=mitch&author=rogersop")
        // .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(2);
          articles.forEach((article) => {
            expect(article.author).toBe("rogersop");
            expect(article.topic).toBe("mitch");
          });
        })
    );
  });
  test("Status 400: responds with an appropriate error when query key is invalid", () => {
    return request(app)
      .get("/api/articles?topix=mitch")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 404: responds with an appropriate error when query value does not produce any article", () => {
    return request(app)
      .get("/api/articles?topic=73")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/articles?:sortingquery=:value", () => {
  test("Status 200: responds with an array of articles sorted by article_id", () => {
  return request(app)
    .get("/api/articles?sort_by=article_id")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(Array.isArray(articles)).toBe(true);
      expect(articles.length).toBe(13);
      expect(articles).toBeSortedBy("article_id", { descending: true });
    });
  });
  test("Status 200: responds with an array of articles sorted by title", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("title", { descending: true });
      });
  });
  test("Status 200: responds with an array of articles in ascending order", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });
  test("Status 200: responds with an array of articles sorted by article_id in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("article_id", { descending: false });
      });
  });
  test("Status 200: responds with an array of articles sorted in ascending order by article_id ", () => {
    return request(app)
      .get("/api/articles?order=asc&sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("article_id", { descending: false });
      });
  });
  test("Status 200: responds with an array of articles sorted in ascending order by article_id and filtered by both topic and author ", () => {
    return request(app)
      .get(
        "/api/articles?topic=mitch&order=asc&sort_by=article_id&author=rogersop"
      )
      // .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(2);
        expect(articles).toBeSortedBy("article_id", { descending: false });
      });
  });
  test("Status 200: responds with an array of articles filtered by both topic and author and sorted in ascending order by article_id ", () => {
    return request(app)
      .get(
        "/api/articles?order=asc&author=rogersop&sort_by=article_id&topic=mitch"
      )
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(2);
        expect(articles).toBeSortedBy("article_id", { descending: false });
      });
  });
  test("Status 400: responds with an appropriate error when query key is invalid", () => {
    return request(app)
      .get("/api/articles?sortByxxx=mitch")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  test("Status 400: responds with an appropriate error when query value does not produce any article", () => {
    return request(app)
      .get("/api/articles?sort_by=73")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("Status-200: responds with an object containing the selected user", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(typeof user[0]).toBe("object");
        expect(user[0]).toMatchObject({
          username: "rogersop",
          name: "paul",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        });
      });
  });
  test("Status 404: responds with an appropriate error when given a username that does not exist", () => {
    return request(app)
      .get("/api/users/forklift")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
});

// describe("DELETE /api/articles/:article_id", () => {
//   test("Status 204: succesfully deletes article with given article_id", () => {
//   return request(app)
//   .delete("/api/articles/2")
//   .expect(204)
//   .then(() => {
//     db.query(`SELECT * FROM articles WHERE article_id = 3;`).then(
//       (data) => {
//         console.log(data);
//         expect(data).toEqual([]);
//       }
//     );
//       });
//   });
//   test("Status 404: article does not exist", () => {
//     return request(app)
//       .delete("/api/articles/99999")
//       .expect(404)
//       .then(({ body: { msg } }) => {
//         expect(msg).toBe("Not found");
//       });
//   });
//   test("Status 400: article_id is not a valid integer", () => {
//     return request(app)
//       .delete("/api/articles/forklift")
//       .expect(400)
//       .then(({ body: { msg } }) => {
//         expect(msg).toBe("Invalid input");
//       });
//   });
// });
describe("", () => {
  test("", () => {});
});
