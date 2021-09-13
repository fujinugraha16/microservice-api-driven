import request from "supertest";
import { app } from "../../app";

// constants
import { Role } from "@fujingr/common";
import { UserPayload } from "@fujingr/common";

// helpers
import { generateCookie, extractCookie } from "@fujingr/common";

test("send 401 when unauthorized", async () => {
  await request(app).get("/api/auth/users").expect(401);
});

test("send 401 when role unauthorized", async () => {
  const cookie = generateCookie(Role.employee);

  const response = await request(app)
    .get("/api/auth/users")
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect(payload.role).not.toEqual(Role.admin);
});

test("send 200 when not fails", async () => {
  await request(app)
    .get("/api/auth/users")
    .set("Cookie", generateCookie())
    .expect(200);
});
