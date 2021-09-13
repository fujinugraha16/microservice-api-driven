import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// routers
import { createUserRouter } from "./routes/create-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { usersRouter } from "./routes/users";
import { userRouter } from "./routes/user";
import { deleteUserRouter } from "./routes/delete-user";

// middlewares
import { errorHandler } from "@fujingr/common";

// errors
import { NotFoundError } from "@fujingr/common";

const app = express();
app.set("trust proxy", true);

// # body parser
app.use(json());

// # cookie sessions
app.use(
  cookieSession({
    signed: false,
    // secure: process.env.NODE_ENV !== "test",
  })
);

app.use(createUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(usersRouter);
app.use(userRouter);
app.use(deleteUserRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// catch error
app.use(errorHandler);

export { app };
