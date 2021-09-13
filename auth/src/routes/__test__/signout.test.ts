import request from "supertest";
import { hashSync } from "bcrypt";
import { app } from "../../app";

// models
import { User } from "../../models/user";

// constans
import { Role } from "@fujingr/common";

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

test("clear cookie and send 200 when signout successfully", async () => {
  const user = await createUser();

  await request(app)
    .post("/api/auth/signin")
    .send({
      username: user.username,
      password: "password",
    })
    .expect(200);

  const response = await request(app)
    .get("/api/auth/signout")
    .send({})
    .expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
