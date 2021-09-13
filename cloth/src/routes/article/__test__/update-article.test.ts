import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload, TypeOfSale } from "@fujingr/common";

// helpers
import { extractCookie, generateCookie } from "@fujingr/common";
import { createArticle, id } from "../../../helpers/article-test";

test("send 401 when unauthorized", async () => {
  await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .send({})
    .expect(401);
});

test("send 401 when role unauthorized", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", cookie)
    .send({});

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request if field must be filled", async () => {
  const [name, typeOfSale] = ["", ""];
  const [width, gsm, safetyStock] = [100, 10, 20];

  await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ name, typeOfSale, width, gsm, safetyStock })
    .expect(400);
});

test("bad request when field must be numeric and more than 0", async () => {
  const [name, typeOfSale] = ["Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = ["asd", -1, 0];

  await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ name, typeOfSale, width, gsm, safetyStock })
    .expect(400);
});

test("optional fields must be array", async () => {
  const [name, typeOfSale] = ["Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];
  const [departments, activities, genders, detailReferences] = [
    123,
    "asd",
    false,
    new Date(),
  ];

  await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", generateCookie())
    .send({
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
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", generateCookie())
    .send({})
    .expect(400);
});

test("bad request if wrong typeOfSale", async () => {
  const [name, typeOfSale] = ["Test", "wkwk"];
  const [width, gsm, safetyStock] = [100, 10, 20];

  await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ name, typeOfSale, width, gsm, safetyStock })
    .expect(400);
});

test("bad request if wrong genders", async () => {
  const [name, typeOfSale] = ["Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];
  const genders = ["wkwkw", "hahaha"];

  await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ name, typeOfSale, width, gsm, safetyStock, genders })
    .expect(400);
});

test("send 400 when bad param 'id'", async () => {
  await request(app)
    .put("/api/cloth/article/update/asfdsdaf")
    .set("Cookie", generateCookie())
    .send({})
    .expect(400);
});

test("send 404 if article not found", async () => {
  const [name, typeOfSale] = ["Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];

  await request(app)
    .put(`/api/cloth/article/update/${id}`)
    .set("Cookie", generateCookie())
    .send({ name, typeOfSale, width, gsm, safetyStock })
    .expect(404);
});

test("send 200 when update article successfully", async () => {
  const article = await createArticle();

  const [name, typeOfSale] = ["Test", TypeOfSale.retail];
  const [width, gsm, safetyStock] = [100, 10, 20];

  const response = await request(app)
    .put(`/api/cloth/article/update/${article.id}`)
    .set("Cookie", generateCookie())
    .send({ name, typeOfSale, width, gsm, safetyStock })
    .expect(200);

  expect(response.body.name).toEqual(name);
  expect(response.body.typeOfSale).toEqual(typeOfSale);
  expect(response.body.width).toEqual(width);
  expect(response.body.gsm).toEqual(gsm);
  expect(response.body.safetyStock).toEqual(safetyStock);
});
