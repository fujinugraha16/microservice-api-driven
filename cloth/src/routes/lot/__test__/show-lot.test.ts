import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createLot, articleId, id } from "../../../helpers/lot-test";

test("send 401 when not provide cookie", async () => {
  await request(app).get("/api/cloth/lot/show/asdfas").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .get("/api/cloth/lot/show/asdfas")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("bad request when param 'id' invalid", async () => {
  await request(app)
    .get("/api/cloth/lot/show/asdfas")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 if lot not found", async () => {
  await request(app)
    .get(`/api/cloth/lot/show/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 200 if lot found", async () => {
  const lot = await createLot();

  const response = await request(app)
    .get(`/api/cloth/lot/show/${lot.id}`)
    .set("Cookie", generateCookie())
    .expect(200);

  expect(response.body.code).toEqual(lot.code);
  expect(response.body.pureLotCode).toEqual(lot.pureLotCode);
  expect(response.body.article.toString()).toEqual(lot.article.toString());
  expect(response.body.supplier).toEqual(lot.supplier);
});
