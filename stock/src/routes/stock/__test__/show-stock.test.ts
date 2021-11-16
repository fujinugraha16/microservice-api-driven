import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createStock, id, articleId } from "../../../helpers/stock-test";

test("send 401 when not provide cookie", async () => {
  await request(app).get("/api/stock/show/asdfasdf").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .get("/api/stock/show/asdfasdf")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .get("/api/stock/show/asdfasdf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if stock not found", async () => {
  await request(app)
    .get(`/api/stock/show/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 200 when stock found", async () => {
  const stock = await createStock(articleId);

  const response = await request(app)
    .get(`/api/stock/show/${stock.id}`)
    .set("Cookie", generateCookie())
    .expect(200);

  expect(response.body.article.toString()).toEqual(articleId.toString());
  expect(response.body.color).toEqual(stock.color);
  expect(response.body.totalQty).toEqual(stock.totalQty);
  expect(response.body.totalLengthInMeters).toEqual(stock.totalLengthInMeters);
  expect(response.body.totalLengthInYards).toEqual(stock.totalLengthInYards);
});
