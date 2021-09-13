import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createPrice, lotId } from "../../../helpers/price-test";
import { createLot } from "../../../helpers/lot-test";

// import
import { Lot } from "../../../models/lot";

test("send 401 when not provide cookie", async () => {
  await request(app).post("/api/cloth/price/create").send({}).expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .post("/api/cloth/price/create")
    .set("Cookie", cookie)
    .send({});

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when fields not filled", async () => {
  await request(app)
    .post("/api/cloth/price/create")
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
    .post("/api/cloth/price/create")
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
    .post("/api/cloth/price/create")
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(400);
});

test("send 400 when price already exist", async () => {
  const price = await createPrice();

  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    price.lot,
    5000,
    10000,
    120000,
  ];

  await request(app)
    .post("/api/cloth/price/create")
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(400);
});

test("send 400 when lot not found", async () => {
  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    lotId,
    5000,
    10000,
    120000,
  ];

  await request(app)
    .post("/api/cloth/price/create")
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(404);
});

test("successfully create price", async () => {
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

  expect(response.body.lot.toString()).toEqual(lot.toString());
  expect(response.body.retailPrice).toEqual(retailPrice);
  expect(response.body.wholesalerPrice).toEqual(wholesalerPrice);
  expect(response.body.lotPrice).toEqual(lotPrice);
});

test("successfully update price in lot", async () => {
  const lotDoc = await createLot();

  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    lotDoc.id,
    5000,
    10000,
    120000,
  ];

  await request(app)
    .post("/api/cloth/price/create")
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(201);

  const existingLot = await Lot.findById(lotDoc.id);

  expect(existingLot!.price).toBeDefined();
});
