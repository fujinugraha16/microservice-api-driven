import request from "supertest";
import { app } from "../../app";
import { hashSync } from "bcrypt";

// constants
import { Role } from "@fujingr/common";

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

test("fails when username that does not exist is supplied", async () => {
  await createUser();

  await request(app)
    .post("/api/auth/signin")
    .send({
      username: "asdfsadf",
      password: "password",
    })
    .expect(400);
});

test("fails when password not match", async () => {
  const user = await createUser();

  await request(app)
    .post("/api/auth/signin")
    .send({
      username: user.username,
      password: "sadfsadf",
    })
    .expect(400);
});

test("response with a cookie when given valid credentials", async () => {
  const user = await createUser();

  const response = await request(app)
    .post("/api/auth/signin")
    .send({
      username: user.username,
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
