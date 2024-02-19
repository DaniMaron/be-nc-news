const request = require("supertest");
const app = require("../app");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db//connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('GET api/topics', () => {
    test('Status-200: responds with an array containing all topics', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                console.log({body});
                expect(body.topics).toHaveLength(3)
                expect(Array.isArray(body.topics)).toBe(true)
            })
    })
})