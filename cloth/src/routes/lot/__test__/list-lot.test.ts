import request from "supertest";
import { app } from "../../../app";

// constants
import { Role, UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";
import { createLot } from "../../../helpers/lot-test";

test("send 401 when not provide cookie", async () => {
  await request(app).get("/api/cloth/lot/list").expect(401);
});

test("send 401 when provide cookie with role customer", async () => {
  const cookie = generateCookie(Role.customer);

  const response = await request(app)
    .get("/api/cloth/lot/list")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect([Role.admin, Role.employee].includes(payload.role)).not.toEqual(true);
});

test("send lots when fetch successfully", async () => {
  await createLot();

  const response = await request(app)
    .get("/api/cloth/lot/list")
    .set("Cookie", generateCookie())
    .expect(200);

  expect(response.body.length).toEqual(1);
});
