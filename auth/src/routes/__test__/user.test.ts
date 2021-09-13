import request from "supertest";
import { Types } from "mongoose";
import { hashSync } from "bcrypt";
import { app } from "../../app";

// models
import { User } from "../../models/user";

// contansts
import { Role } from "@fujingr/common";
import { UserPayload } from "@fujingr/common";

// helpers
import { extractCookie, generateCookie } from "@fujingr/common";

const id = new Types.ObjectId().toHexString();

test("send 401 when unauthorized", async () => {
  await request(app).get(`/api/auth/user/${id}`).expect(401);
});

test("send 401 when role unauthorized", async () => {
  const cookie = generateCookie(Role.employee);

  const response = await request(app)
    .get(`/api/auth/user/${id}`)
    .set("Cookie", cookie);

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect(payload.role).not.toEqual(Role.admin);
});

test("bad request when param 'id' is invalid", async () => {
  await request(app)
    .get("/api/auth/user/asdfasdfs")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 when user not found", async () => {
  await request(app)
    .get(`/api/auth/user/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("send 200 when user found", async () => {
  const user = new User({
    username: "test",
    password: hashSync("password", 12),
    role: Role.employee,
    name: "Test User",
  });
  await user.save();

  const response = await request(app)
    .get(`/api/auth/user/${user.id}`)
    .set("Cookie", generateCookie())
    .expect(200);

  expect(response.body.username).toEqual(user.username);
  expect(response.body.role).toEqual(user.role);
  expect(response.body.name).toEqual(user.name);
});
