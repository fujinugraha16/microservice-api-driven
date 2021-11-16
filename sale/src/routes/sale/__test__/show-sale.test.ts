import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createSale, id } from "../../../helpers/sale-test";

test("send 401 when not provide cookie", async () => {
  await request(app).get("/api/sale/show/asdfasdf").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .get("/api/sale/show/asdfasdf")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .get("/api/sale/show/asdfasdf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if sale not found", async () => {
  await request(app)
    .get(`/api/sale/show/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 200 when sale found", async () => {
  const sale = await createSale();

  const response = await request(app)
    .get(`/api/sale/show/${sale.id.toString()}`)
    .set("Cookie", generateCookie())
    .expect(200);

  expect(response.body.id.toString()).toEqual(sale.id.toString());
  expect(response.body.totalQty).toEqual(sale.totalQty);
  expect(response.body.totalPrice).toEqual(sale.totalPrice);
});
