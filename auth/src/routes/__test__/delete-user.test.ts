import request from "supertest";
import { hashSync } from "bcrypt";
import { Types } from "mongoose";
import { app } from "../../app";

// models
import { User } from "../../models/user";

// constants
import { Role } from "@fujingr/common";

// helper
import { generateCookie, extractCookie } from "@fujingr/common";
import { UserPayload } from "@fujingr/common";

const createUser = async () => {
  const user = new User({
    username: "test",
    password: hashSync("password", 12),
    role: Role.employee,
    name: "Test User",
  });
  await user.save();

  return user;
};

const id = new Types.ObjectId().toHexString();

test("send 401 when unauthorized", async () => {
  await request(app).delete(`/api/auth/delete-user/${id}`).expect(401);
});

test("send 401 when role not authorized", async () => {
  const cookie = generateCookie(Role.employee);

  const response = await request(app)
    .delete(`/api/auth/delete-user/${id}`)
    .set("Cookie", cookie);
  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect(payload.role).not.toEqual(Role.admin);
});

test("bad request error when param 'id' invalid", async () => {
  await createUser();

  await request(app)
    .delete("/api/auth/delete-user/asfasdf")
    .set("Cookie", generateCookie())
    .expect(400);
});

test("send 404 when user not found", async () => {
  await request(app)
    .delete(`/api/auth/delete-user/${id}`)
    .set("Cookie", generateCookie())
    .expect(404);
});

test("user has been cleared", async () => {
  const user = await createUser();

  await request(app)
    .delete(`/api/auth/delete-user/${user.id}`)
    .set("Cookie", generateCookie())
    .expect(204);

  const checkUser = await User.findById(user.id);

  expect(checkUser).toBeNull();
});
