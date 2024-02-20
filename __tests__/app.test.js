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
      });
  });
  test("Status 404: responds with an appropriate error when given an article Id that does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
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
