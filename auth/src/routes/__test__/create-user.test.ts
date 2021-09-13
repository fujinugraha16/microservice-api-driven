import request from "supertest";
import { app } from "../../app";
import { hashSync } from "bcrypt";

// constants
import { Role } from "@fujingr/common";
import { UserPayload } from "@fujingr/common";

// helpers
import { extractCookie, generateCookie } from "@fujingr/common";

// models
import { User } from "../../models/user";

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

test("send 401 (not authorized) error if unauthorized", async () => {
  await request(app).post("/api/auth/create-user").send({}).expect(401);
});

test("send 401 when role unauthorized", async () => {
  const cookie = generateCookie(Role.employee);

  const response = await request(app)
    .post("/api/auth/create-user")
    .set("Cookie", cookie)
    .send({});

  const payload = extractCookie(cookie) as UserPayload;

  expect(response.statusCode).toEqual(401);
  expect(payload.role).not.toEqual(Role.admin);
});

test("fails when given invalid inputs", async () => {
  await request(app)
    .post("/api/auth/create-user")
    .set("Cookie", generateCookie())
    .send({
      username: "",
      password: "111",
      role: "",
      name: "",
      email: "test@test",
    })
    .expect(400);
});

test("fails when user already exists", async () => {
  const user = await createUser();

  await request(app)
    .post("/api/auth/create-user")
    .set("Cookie", generateCookie())
    .send({
      username: user.username,
      password: "password",
      role: Role.employee,
      name: "Test User",
    })
    .expect(400);
});

test("send 201 when create successfully", async () => {
  const username = "wkwkwk";
  const password = "password";
  const role = Role.employee;
  const name = "Test User";

  const response = await request(app)
    .post("/api/auth/create-user")
    .set("Cookie", generateCookie())
    .send({
      username,
      password,
      role,
      name,
    })
    .expect(201);

  expect(response.body.username).toEqual(username);
  expect(response.body.role).toEqual(role);
  expect(response.body.name).toEqual(name);
});
