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
                expect(body.topics).toHaveLength(3)
                expect(Array.isArray(body.topics)).toBe(true)
            })
    })
})

describe('GET api', () => {
    test('Status-200: responds with an object containing all endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({body}) => {
                expect(typeof body).toBe('object')
                expect(Object.keys(body)).toHaveLength(3)
                expect(body["GET /api"].description).toEqual(
                  "serves up a json representation of all the available endpoints of the api"
                )
                Object.keys(body).forEach((endpoint) => {
                    expect(Object.keys(body[endpoint]).includes('description')).toBe(true)
                    expect(Object.keys(body[endpoint]).includes('queries')).toBe(true)
                    expect(Object.keys(body[endpoint]).includes('exampleResponse')).toBe(true)
                })
            })
    })
})