const request = require("supertest")
const Knex = require("knex")
const app = require("src")

describe("request api", () => {
  it("Testing to see if Jest works", async () => {
    await request(app).get("/request/list").set("Authorization", "abc123").expect(200)
  })
})
