import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createPrice, id, lotId } from "../../../helpers/price-test";
import { createLot } from "../../../helpers/lot-test";

// models
import { Lot } from "../../../models/lot";

test("send 401 when not provide cookie", async () => {
  await request(app)
    .put("/api/cloth/price/update/asdfasdf")
    .send({})
    .expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .put("/api/cloth/price/update/asdfasdf")
    .set("Cookie", cookie)
    .send({});

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .put("/api/cloth/price/update/asdfasdf")
    .set("Cookie", generateCookie())
    .send({})
    .expect(400);
});

test("bad request when fields not filled", async () => {
  await request(app)
    .put(`/api/cloth/price/update/${id}`)
    .set("Cookie", generateCookie())
    .send({})
    .expect(400);
});

test("bad request when field 'lot' invalid", async () => {
  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    "test",
    5000,
    10000,
    120000,
  ];

  await request(app)
    .put(`/api/cloth/price/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(400);
});

test("bad request when fields number filled with other types or less than 0", async () => {
  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    lotId,
    "5000",
    -10000,
    true,
  ];

  await request(app)
    .put(`/api/cloth/price/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(400);
});

test("send 404 if price not found", async () => {
  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    lotId,
    5000,
    10000,
    120000,
  ];

  await request(app)
    .put(`/api/cloth/price/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(404);
});

test("bad request if price already exists", async () => {
  const lotDoc = await createLot();
  const price1 = await createPrice();
  const price2 = await createPrice(lotDoc.id);

  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    price2.lot,
    5000,
    10000,
    120000,
  ];

  await request(app)
    .put(`/api/cloth/price/update/${price1.id}`)
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(400);
});

test("send 404 when new existing lot not found", async () => {
  const lotDoc = await createLot();
  const price = await createPrice(lotDoc.id);

  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    id,
    5000,
    10000,
    120000,
  ];

  await request(app)
    .put(`/api/cloth/price/update/${price.id}`)
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(404);
});

test("price has been cleared from old existing lot and save to new existing lot", async () => {
  const lotDoc1 = await createLot();
  const lotDoc2 = await createLot(id);

  const [lot1, lot2, retailPrice, wholesalerPrice, lotPrice] = [
    lotDoc1.id,
    lotDoc2.id,
    5000,
    10000,
    120000,
  ];

  const response = await request(app)
    .post("/api/cloth/price/create")
    .set("Cookie", generateCookie())
    .send({ lot: lot1, retailPrice, wholesalerPrice, lotPrice })
    .expect(201);

  let oldExistingLot = await Lot.findById(lot1);

  expect(oldExistingLot!.price).toBeDefined();

  await request(app)
    .put(`/api/cloth/price/update/${response.body.id}`)
    .set("Cookie", generateCookie())
    .send({ lot: lot2, retailPrice, wholesalerPrice, lotPrice })
    .expect(200);

  oldExistingLot = await Lot.findById(lot1);
  const newExistingLot = await Lot.findById(lot2);

  expect(oldExistingLot!.price).toBeUndefined();
  expect(newExistingLot!.price).toBeDefined();
});

test("update price successfully", async () => {
  const lotDoc1 = await createLot();
  const lotDoc2 = await createLot(id);
  const price = await createPrice(lotDoc1.id);

  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    lotDoc2.id,
    6000,
    12000,
    200000,
  ];

  const response = await request(app)
    .put(`/api/cloth/price/update/${price.id}`)
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(200);

  expect(response.body.lot.toString()).toEqual(lot.toString());
  expect(response.body.retailPrice).toEqual(retailPrice);
  expect(response.body.wholesalerPrice).toEqual(wholesalerPrice);
  expect(response.body.lotPrice).toEqual(lotPrice);
});
