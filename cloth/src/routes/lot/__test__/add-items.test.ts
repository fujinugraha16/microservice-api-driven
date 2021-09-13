import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie, randomString } from "@fujingr/common";
import { createLot, articleId, id } from "../../../helpers/lot-test";
import { createArticle } from "../../../helpers/article-test";

// models
import { Item } from "../../../models/item";
import { Lot } from "../../../models/lot";

test("send 401 when not provide cookie", async () => {
  await request(app)
    .put("/api/cloth/lot/asdfas/add-items")
    .send({})
    .expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .put("/api/cloth/lot/asdfas/add-items")
    .send({})
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .put("/api/cloth/lot/asdfas/add-items")
    .set("Cookie", generateCookie())
    .send({})
    .expect(400);
});

test("send 400 when field 'designs' not array", async () => {
  const designs = "test";

  await request(app)
    .put(`/api/cloth/lot/${id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(400);
});

test("send 400 when field 'designs' empty array", async () => {
  const designs: string[] = [];

  await request(app)
    .put(`/api/cloth/lot/${id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(400);
});

test("bad request when field 'designs' filled array with string", async () => {
  const designs = ["test"];

  await request(app)
    .put(`/api/cloth/lot/${id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(400);
});

test("bad request when field 'designs' wrong or less key of object array", async () => {
  const designs = [{ code: "123", name: "test", hex: "#fff" }];

  await request(app)
    .put(`/api/cloth/lot/${id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(400);
});

test("bad request when field 'designs' have 'items' with wrong types", async () => {
  const designs = [
    { code: "123", name: "test", color: "#fff", items: ["test items"] },
  ];

  await request(app)
    .put(`/api/cloth/lot/${id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(400);
});

test("bad request when field 'designs' have 'items' with wrong or less key of object array", async () => {
  const designs = [
    {
      code: "123",
      name: "test",
      color: "#fff",
      items: [{ length: 10, total: 2 }],
    },
  ];

  await request(app)
    .put(`/api/cloth/lot/${id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(400);
});

test("send 404 when lot not found", async () => {
  const designs = [
    {
      code: "123",
      name: "test",
      color: "#fff",
      items: [{ length: 10, qty: 2 }],
    },
  ];

  await request(app)
    .put(`/api/cloth/lot/${id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(404);
});

test("items successfully added", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  let designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [{ length: 40, qty: 1 }],
    },
  ];

  const response = await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(201);

  let totalItemDocs = await Item.find().countDocuments();

  expect(totalItemDocs).toEqual(1);

  // -----

  designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [
        { length: 38, qty: 2 },
        { length: 42, qty: 3 },
      ],
    },
  ];

  await request(app)
    .put(`/api/cloth/lot/${response.body.id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs });

  totalItemDocs = await Item.find().countDocuments();

  expect(totalItemDocs).toEqual(6);
});

test("lot inputSequence has been updated", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  let designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [{ length: 40, qty: 1 }],
    },
  ];

  const response = await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(201);

  designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [{ length: 40, qty: 1 }],
    },
  ];

  await request(app)
    .put(`/api/cloth/lot/${response.body.id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs });

  const existingLot = await Lot.findById(response.body.id).select(
    "inputSequence"
  );

  expect(existingLot!.inputSequence).toEqual(2);
});

test("send 200 when successfully add items to lot", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  let designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [{ length: 40, qty: 1 }],
    },
  ];

  const response = await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(201);

  designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [{ length: 40, qty: 1 }],
    },
  ];

  await request(app)
    .put(`/api/cloth/lot/${response.body.id}/add-items`)
    .set("Cookie", generateCookie())
    .send({ designs })
    .expect(200);
});
