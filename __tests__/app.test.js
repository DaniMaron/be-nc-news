const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db//connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET api/topics", () => {
  test("Status-200: responds with an array containing all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });
});

describe("GET api", () => {
  test("Status-200: responds with an object containing all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body["GET /api"].description).toEqual(
          "serves up a json representation of all the available endpoints of the api"
        );
        Object.keys(body).forEach((endpoint) => {
          expect(Object.keys(body[endpoint]).includes("description")).toBe(
            true
          );
          expect(Object.keys(body[endpoint]).includes("queries")).toBe(true);
          expect(Object.keys(body[endpoint]).includes("exampleResponse")).toBe(
            true
          );
        });
      });
  });
});

describe("GET api/articles/:article_id", () => {
  test("Status-200: responds with an object containing the selected article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");

        expect(Object.keys(body[0]).includes("author")).toBe(true);
        expect(Object.keys(body[0]).includes("title")).toBe(true);
        expect(Object.keys(body[0]).includes("article_id")).toBe(true);
        expect(Object.keys(body[0]).includes("body")).toBe(true);
        expect(Object.keys(body[0]).includes("topic")).toBe(true);
        expect(Object.keys(body[0]).includes("created_at")).toBe(true);
        expect(Object.keys(body[0]).includes("votes")).toBe(true);
        expect(Object.keys(body[0]).includes("article_img_url")).toBe(true);

        expect(body[0].author).toBe("icellusedkars");
        expect(body[0].title).toBe("Eight pug gifs that remind me of mitch");
        expect(body[0].article_id).toBe(3);
        expect(body[0].body).toBe("some gifs");
        expect(body[0].topic).toBe("mitch");
        expect(body[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(body[0].votes).toBe(0);
        expect(body[0].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
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

describe("GET api/articles", () => {
  test("Status-200: responds with an array containing all articles ordered by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(13);
        expect(Object.keys(body[0]).includes("author")).toBe(true);
        expect(Object.keys(body[0]).includes("title")).toBe(true);
        expect(Object.keys(body[0]).includes("article_id")).toBe(true);
        expect(Object.keys(body[0]).includes("topic")).toBe(true);
        expect(Object.keys(body[0]).includes("created_at")).toBe(true);
        expect(Object.keys(body[0]).includes("votes")).toBe(true);
        expect(Object.keys(body[0]).includes("article_img_url")).toBe(true);

        expect(body[0].author).toBe("icellusedkars");
        expect(body[0].title).toBe("Eight pug gifs that remind me of mitch");
        expect(body[0].article_id).toBe(3);
        expect(body[0].topic).toBe("mitch");
        expect(body[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(body[0].votes).toBe(0);
        expect(body[0].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );

        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });

  test("Status 200: responds with an array of articles each containing a comments_count key with the total value of comments for said article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body[0].comment_count).toBe("2");
        expect(body[1].comment_count).toBe("1");
        expect(body[12].comment_count).toBe("0");
        expect(body[6].comment_count).toBe("11");
      });
  });
});
describe("GET api/articles/:article_id/comments", () => {
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
describe("POST api/articles/:article_id/comments", () => {
  test("Status-201: responds with an object containing the newly posted comment and adds it to the comments table", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Lovely article!",
      created_at: new Date(),
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(typeof body[0]).toBe("object");
        expect(body[0]).toMatchObject({
          comment_id: 19,
          votes: 0,
          created_at: newComment.created_at.toISOString(),
          author: "icellusedkars",
          body: "Lovely article!",
          article_id: 2
        });
        
        db.query(`SELECT * FROM comments WHERE comment_id = 19`)
          .then(({ rows }) => {
            expect(rows[0]).toMatchObject({
              comment_id: 19,
              votes: 0,
              created_at: newComment.created_at,
              author: "icellusedkars",
              body: "Lovely article!",
              article_id: 2,
            }); 
        })
      })
  })
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
