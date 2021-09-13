import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createPrice, id } from "../../../helpers/price-test";

test("send 401 when not provide cookie", async () => {
  await request(app).get("/api/cloth/price/show/asdfasdf").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .get("/api/cloth/price/show/asdfasdf")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .get("/api/cloth/price/show/asdfasdf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if price not found", async () => {
  await request(app)
    .get(`/api/cloth/price/show/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 200 when price found", async () => {
  const price = await createPrice();

  const response = await request(app)
    .get(`/api/cloth/price/show/${price.id}`)
    .set("Cookie", generateCookie())
    .expect(200);

  expect(response.body.lot.toString()).toEqual(price.lot.toString());
  expect(response.body.retailPrice).toEqual(price.retailPrice);
  expect(response.body.wholesalerPrice).toEqual(price.wholesalerPrice);
  expect(response.body.lotPrice).toEqual(price.lotPrice);
});
