import request from "supertest";
import { app } from "../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createStock, id } from "../../helpers/stock-test";

test("send 401 when not provide cookie", async () => {
  await request(app).get("/api/stock/detail/asdfasdf").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .get("/api/stock/detail/asdfasdf")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .get("/api/stock/detail/asdfasdf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if stock not found", async () => {
  await request(app)
    .get(`/api/stock/detail/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 200 when stock with detailStocks found", async () => {
  const stock = await createStock();

  await request(app)
    .get(`/api/stock/detail/${stock.id}`)
    .set("Cookie", generateCookie())
    .expect(200);
});
