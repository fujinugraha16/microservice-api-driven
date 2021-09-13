import request from "supertest";
import { app } from "../../../app";

// models
import { Article } from "../../../models/article";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createArticle, id } from "../../../helpers/article-test";
import { createLot } from "../../../helpers/lot-test";

test("send 401 when not provide cookie", async () => {
  await request(app).delete(`/api/cloth/article/delete/${id}`).expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .delete(`/api/cloth/article/delete/${id}`)
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("send 400 when bad param 'id'", async () => {
  await request(app)
    .delete("/api/cloth/article/delete/asfdsdaf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if article not found", async () => {
  await request(app)
    .delete(`/api/cloth/article/delete/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 403 if article used by others", async () => {
  const article = await createArticle();
  await createLot(article.id);

  await request(app)
    .delete(`/api/cloth/article/delete/${article.id}`)
    .set("Cookie", generateCookie())
    .expect(403);
});

test("send 204 when delete successfully", async () => {
  const article = await createArticle();

  await request(app)
    .delete(`/api/cloth/article/delete/${article.id}`)
    .set("Cookie", generateCookie())
    .expect(204);

  const checkArticle = await Article.findById(article.id);

  expect(checkArticle).toBeNull();
});
