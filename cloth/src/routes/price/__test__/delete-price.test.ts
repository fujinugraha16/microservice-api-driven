import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createPrice, id } from "../../../helpers/price-test";
import { createLot } from "../../../helpers/lot-test";

// models
import { Price } from "../../../models/price";
import { Lot } from "../../../models/lot";

test("send 401 when not provide cookie", async () => {
  await request(app).delete("/api/cloth/price/delete/asdfasdf").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .delete("/api/cloth/price/delete/asdfasdf")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .delete("/api/cloth/price/delete/asdfasdf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if price not found", async () => {
  await request(app)
    .delete(`/api/cloth/price/delete/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("successfully cleared price from lot", async () => {
  const lotDoc = await createLot();

  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    lotDoc.id,
    5000,
    10000,
    120000,
  ];

  const response = await request(app)
    .post("/api/cloth/price/create")
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(201);

  let existingLot = await Lot.findById(lotDoc.id);

  expect(existingLot!.price).toBeDefined();

  await request(app)
    .delete(`/api/cloth/price/delete/${response.body.id}`)
    .set("Cookie", generateCookie())
    .expect(204);

  existingLot = await Lot.findById(lotDoc.id);

  expect(existingLot!.price).toBeUndefined();
});

test("send 204 when price successfully cleared", async () => {
  const price = await createPrice();

  await request(app)
    .delete(`/api/cloth/price/delete/${price.id}`)
    .set("Cookie", generateCookie())
    .expect(204);

  const checkPrice = await Price.findById(price.id);

  expect(checkPrice).toBeNull();
});
