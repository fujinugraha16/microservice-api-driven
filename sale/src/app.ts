import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// routers
import { createSaleRouter } from "./routes/create-sale";
import { listSaleRouter } from "./routes/list-sale";
import { showSaleRouter } from "./routes/show-sale";

// middlewares
import { errorHandler, currentUser } from "@fujingr/common";

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

// authentication
app.use(currentUser);

app.use(createSaleRouter);
app.use(showSaleRouter);
app.use(listSaleRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// catch errors
app.use(errorHandler);

export { app };
