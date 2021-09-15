import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";

// constants
import { randomString, Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createSale } from "../../helpers/sale-test";

test("send 401 when not provide cookie", async () => {
  await request(app).post("/api/sale/create").send({}).expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .post("/api/sale/create")
    .set("Cookie", cookie)
    .send({});

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when fields not filled", async () => {
  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({})
    .expect(400);
});

test("bad request when field array not filled with array", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = [1_000_000, 100];
  const [retailItems, wholesalerItems, lotItems] = ["test", "test", "test"];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field numeric not filled with numeric or less than 0", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = ["test", "test", "test"];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'retailItems' filled array string", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    ["test"],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    [
      {
        price: 2_000_000,
        items: [
          {
            itemId: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
            lengthInMeters: 60,
          },
        ],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'retailItems' wrong or less key of object array", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        wkoko: 50,
      },
    ],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    [
      {
        price: 2_000_000,
        items: [
          {
            itemId: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
            lengthInMeters: 60,
          },
        ],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'wholesalerItems' filled array string", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    ["test"],
    [
      {
        price: 2_000_000,
        items: [
          {
            itemId: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
            lengthInMeters: 60,
          },
        ],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'wholesalerItems' wrong or less key of object array", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    [
      {
        wwewkre: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
      },
    ],
    [
      {
        price: 2_000_000,
        items: [
          {
            itemId: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
            lengthInMeters: 60,
          },
        ],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'lotItems' filled array string", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    ["test"],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'lotItems' wrong or less key of object array", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    [
      {
        asdfasd: 2_000_000,
        items: [
          {
            itemId: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
            lengthInMeters: 60,
          },
        ],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'lotItems.items' wrong or less key of object array", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    [
      {
        price: 2_000_000,
        items: [
          {
            sdfasfa: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
          },
        ],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("bad request when field 'lotItems' have 'items' with wrong types", async () => {
  const [code, customerName] = [`SL-${randomString(5)}`, "Test Customer"];
  const [totalPrice, totalQty] = ["1_000_000", -100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    [
      {
        price: 2_000_000,
        items: ["test"],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("send 400 when sale already exist", async () => {
  const saleDoc = await createSale();

  const [code, customerName] = [saleDoc.code, "Test Customer"];
  const [totalPrice, totalQty] = [1_000_000, 100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    [
      {
        asdfasd: 2_000_000,
        items: [
          {
            itemId: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
            lengthInMeters: 60,
          },
        ],
      },
    ],
  ];

  await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(400);
});

test("send 201 when successfully create sale", async () => {
  const saleCode = `SL-${randomString(5)}`;

  const [code, customerName] = [saleCode, "Test Customer"];
  const [totalPrice, totalQty] = [1_000_000, 100];
  const [retailItems, wholesalerItems, lotItems] = [
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 20_000,
        lengthInMeters: 10,
      },
    ],
    [
      {
        itemId: new Types.ObjectId().toHexString(),
        qrCode: randomString(5),
        price: 400_000,
        lengthInMeters: 50,
      },
    ],
    [
      {
        price: 2_000_000,
        items: [
          {
            itemId: new Types.ObjectId().toHexString(),
            qrCode: randomString(5),
            lengthInMeters: 60,
          },
        ],
      },
    ],
  ];

  const response = await request(app)
    .post("/api/sale/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      customerName,
      totalPrice,
      totalQty,
      retailItems,
      wholesalerItems,
      lotItems,
    })
    .expect(201);

  expect(response.body.code).toEqual(saleCode);
  expect(response.body.totalQty).toEqual(3);
  expect(response.body.totalPrice).toEqual(20_000 + 400_000 + 2_000_000);
});
