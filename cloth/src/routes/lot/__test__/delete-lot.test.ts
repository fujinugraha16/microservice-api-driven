import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie, randomString } from "@fujingr/common";
import { createArticle } from "../../../helpers/article-test";
import { createLot, articleId, id } from "../../../helpers/lot-test";

// models
import { Lot } from "../../../models/lot";
import { Design } from "../../../models/design";
import { Item } from "../../../models/item";
import { Price } from "../../../models/price";

test("send 401 when not provide cookie", async () => {
  await request(app).delete("/api/cloth/lot/delete/asdfas").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .delete("/api/cloth/lot/delete/asdfas")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .delete("/api/cloth/lot/delete/asdfas")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if lot not found", async () => {
  await request(app)
    .delete(`/api/cloth/lot/delete/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 403 if lot used by other documents", async () => {
  const lot = await createLot(articleId, 2);

  await request(app)
    .delete(`/api/cloth/lot/delete/${lot.id}`)
    .set("Cookie", generateCookie())
    .expect(403);
});

test("designs and items has been deleted", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test",
      color: "#fff",
      items: [{ length: 10, qty: 1 }],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(201);

  const lot = await Lot.findOne({ pureLotCode });
  let totalDesignDocs = await Design.find().countDocuments();
  let totalItemDocs = await Item.find().countDocuments();

  expect(totalDesignDocs).toEqual(1);
  expect(totalItemDocs).toEqual(1);

  await request(app)
    .delete(`/api/cloth/lot/delete/${lot!.id}`)
    .set("Cookie", generateCookie())
    .expect(204);

  totalDesignDocs = await Design.find().countDocuments();
  totalItemDocs = await Item.find().countDocuments();

  expect(totalDesignDocs).toEqual(0);
  expect(totalItemDocs).toEqual(0);
});

test("successfully deleted lot", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test",
      color: "#fff",
      items: [{ length: 10, qty: 1 }],
    },
  ];

  const response = await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(201);

  await request(app)
    .delete(`/api/cloth/lot/delete/${response.body.id}`)
    .set("Cookie", generateCookie())
    .expect(204);

  const checkLot = await Lot.findById(response.body.id);
  expect(checkLot).toBeNull();
});

test("delete price too if lot have price", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test",
      color: "#fff",
      items: [{ length: 10, qty: 1 }],
    },
  ];

  const responseLot = await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(201);

  const [lot, retailPrice, wholesalerPrice, lotPrice] = [
    responseLot.body.id,
    5000,
    10000,
    120000,
  ];

  const responsePrice = await request(app)
    .post("/api/cloth/price/create")
    .set("Cookie", generateCookie())
    .send({ lot, retailPrice, wholesalerPrice, lotPrice })
    .expect(201);

  await request(app)
    .delete(`/api/cloth/lot/delete/${responseLot.body.id}`)
    .set("Cookie", generateCookie())
    .expect(204);

  const checkLot = await Lot.findById(responseLot.body.id);
  expect(checkLot).toBeNull();

  const checkPrice = await Price.findById(responsePrice.body.id);
  expect(checkPrice).toBeNull();
});
