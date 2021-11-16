import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// routers
import { lotInRouter } from "./routes/lot/lot-in";
import { lotOutRouter } from "./routes/lot/lot-out";
import { createArticleRouter } from "./routes/article/create-article";
import { deleteArticleRouter } from "./routes/article/delete-article";
import { updateArticleRouter } from "./routes/article/update-article";
import { showStockRouter } from "./routes/stock/show-stock";
import { listStockRouter } from "./routes/stock/list-stock";
import { inOutStockRouter } from "./routes/stock/in-out";
import { detailStockRouter } from "./routes/stock/detail-stock";
import { stockSaleRouter } from "./routes/stock/stock-sale";

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

app.use(lotInRouter);
app.use(lotOutRouter);
app.use(createArticleRouter);
app.use(deleteArticleRouter);
app.use(updateArticleRouter);
app.use(stockSaleRouter);
app.use(showStockRouter);
app.use(listStockRouter);
app.use(inOutStockRouter);
app.use(detailStockRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// catch errors
app.use(errorHandler);

export { app };
