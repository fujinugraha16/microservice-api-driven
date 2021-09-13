import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload, TypeOfSale } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createArticle } from "../../../helpers/article-test";

test("send 401 when not provide cookie", async () => {
  await request(app).post("/api/cloth/article/create").send({}).expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", cookie)
    .send({});

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request if field must be filled", async () => {
  const [code, name, typeOfSale] = ["", "", ""];
  const [width, gsm, safetyStock] = [100, 10, 20];

  await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
    })
    .expect(400);
});

test("bad request when field must be numeric and more than 0", async () => {
  const [code, name, typeOfSale] = ["ASDF", "Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = ["asd", -1, 0];

  await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
    })
    .expect(400);
});

test("optional fields must be array", async () => {
  const [code, name, typeOfSale] = ["ASDF", "Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];
  const [departments, activities, genders, detailReferences] = [
    123,
    "asd",
    false,
    new Date(),
  ];

  await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
      departments,
      activities,
      genders,
      detailReferences,
    })
    .expect(400);
});

test("fails if all fields required empty", async () => {
  await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({})
    .expect(400);
});

test("send 400 when code already exists", async () => {
  const [code, name, typeOfSale] = ["ARTICLE", "Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];

  await createArticle();

  await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
    })
    .expect(400);
});

test("bad request if wrong typeOfSale", async () => {
  const [code, name, typeOfSale] = ["DFD", "Test", "wkwk"];
  const [width, gsm, safetyStock] = [100, 10, 20];

  await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
    })
    .expect(400);
});

test("bad request if wrong genders", async () => {
  const [code, name, typeOfSale] = ["DFA", "Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];
  const genders = ["wkwkw", "hahaha"];

  await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
      genders,
    })
    .expect(400);
});

test("send 201 when create article successfully", async () => {
  const [code, name, typeOfSale] = ["DFAS", "Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];

  const response = await request(app)
    .post("/api/cloth/article/create")
    .set("Cookie", generateCookie())
    .send({
      code,
      name,
      typeOfSale,
      width,
      gsm,
      safetyStock,
    })
    .expect(201);

  expect(response.body.code).toEqual(code);
  expect(response.body.name).toEqual(name);
  expect(response.body.typeOfSale).toEqual(typeOfSale);
  expect(response.body.width).toEqual(width);
  expect(response.body.gsm).toEqual(gsm);
  expect(response.body.safetyStock).toEqual(safetyStock);
});
