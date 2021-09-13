import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createArticle, id } from "../../../helpers/article-test";

test("send 401 when not provide cookie", async () => {
  await request(app).get(`/api/cloth/article/show/${id}`).expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .get(`/api/cloth/article/show/${id}`)
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("send 400 when bad param 'id'", async () => {
  await request(app)
    .get("/api/cloth/article/show/asfdsdaf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if article not found", async () => {
  await request(app)
    .get(`/api/cloth/article/show/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send article if found", async () => {
  const article = await createArticle();

  const response = await request(app)
    .get(`/api/cloth/article/show/${article.id}`)
    .set("Cookie", generateCookie())
    .expect(200);

  expect(response.body.code).toEqual(article.code);
  expect(response.body.name).toEqual(article.name);
  expect(response.body.typeOfSale).toEqual(article.typeOfSale);
  expect(response.body.width).toEqual(article.width);
  expect(response.body.gsm).toEqual(article.gsm);
  expect(response.body.safetyStock).toEqual(article.safetyStock);
});
