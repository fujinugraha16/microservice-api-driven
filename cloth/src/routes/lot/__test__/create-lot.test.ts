import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie, randomString } from "@fujingr/common";
import { createLot, articleId } from "../../../helpers/lot-test";
import { createArticle } from "../../../helpers/article-test";

// models
import { Lot } from "../../../models/lot";
import { Design } from "../../../models/design";
import { Item } from "../../../models/item";

const axios = {
  post: jest.fn(),
};

test("send 401 when not provide cookie", async () => {
  await request(app).post("/api/cloth/lot/create").send({}).expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", cookie)
    .send({});

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when field not filled", async () => {
  const [pureLotCode, article, supplier] = ["", "", ""];
  const designs = ["test"];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("bad request if field 'designs' not filled array", async () => {
  const [pureLotCode, article, supplier] = ["ASDF", "asdfsadf", "hehehe"];
  const designs = "wkwk";

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("bad request if field 'designs' empty array", async () => {
  const [pureLotCode, article, supplier] = ["ASDF", "asdfsadf", "hehehe"];
  const designs: string[] = [];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("send 400 if field 'article' invalid", async () => {
  const [pureLotCode, article, supplier] = ["ASDF", "asdfsadf", "hehehe"];
  const designs = ["test"];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("bad request when field 'designs' filled array string", async () => {
  const articleDoc = await createArticle();
  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = ["test"];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("bad request when field 'designs' wrong or less key of object array", async () => {
  const articleDoc = await createArticle();
  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [{ code: "123", name: "test", hex: "#fff" }];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("bad request when field 'designs' have 'items' with wrong types", async () => {
  const articleDoc = await createArticle();
  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [
    { code: "123", name: "test", color: "#fff", items: ["test items"] },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("bad request when field 'designs' have 'items' with wrong or less key of object array", async () => {
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
      items: [{ length: 10, total: 2 }],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("send 404 error if article not found", async () => {
  const [pureLotCode, article, supplier] = [
    "ASDF",
    articleId,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test",
      color: "#fff",
      items: [{ length: 10, qty: 2 }],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(404);
});

test("if lot already exist send bad request", async () => {
  const articleDoc = await createArticle();
  const existingLot = await createLot(articleDoc.id);

  const [pureLotCode, article, supplier] = [
    "LOT",
    existingLot.article,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test",
      color: "#fff",
      items: [{ length: 10, qty: 2 }],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(400);
});

test("successfully create lot data", async () => {
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
      items: [{ length: 10, qty: 2 }],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs })
    .expect(201);

  const lot = await Lot.findOne({ pureLotCode });
  expect(lot).not.toBeNull();
});

test("successfully create designs data", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [{ length: 40, qty: 1 }],
    },
    {
      code: "124",
      name: "test 2",
      color: "#fff",
      items: [{ length: 38, qty: 2 }],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs });

  const totalDesignDocs = await Design.find().countDocuments();

  expect(totalDesignDocs).toEqual(2);
});

test("successfully create items data", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [
        { length: 40, qty: 1 },
        { length: 39, qty: 2 },
        { length: 38, qty: 3 },
      ],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs });

  const totalItemDocs = await Item.find().countDocuments();

  expect(totalItemDocs).toEqual(6);
});

test("successfully create items data", async () => {
  const articleDoc = await createArticle();

  const [pureLotCode, article, supplier] = [
    randomString(5),
    articleDoc.id,
    "PT. Aliex Retail",
  ];
  const designs = [
    {
      code: "123",
      name: "test 1",
      color: "#000",
      items: [
        { length: 40, qty: 1 },
        { length: 39, qty: 2 },
        { length: 38, qty: 3 },
      ],
    },
  ];

  await request(app)
    .post("/api/cloth/lot/create")
    .set("Cookie", generateCookie())
    .send({ pureLotCode, article, supplier, designs });

  expect(axios.post).toHaveBeenCalled();
});
