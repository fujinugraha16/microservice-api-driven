import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

// routers
import { createArticleRouter } from "./routes/article/create-article";
import { updateArticleRouter } from "./routes/article/update-article";
import { deleteArticleRouter } from "./routes/article/delete-article";
import { showArticleRouter } from "./routes/article/show-article";
import { listArticlesRouter } from "./routes/article/list-articles";

import { createLotRouter } from "./routes/lot/create-lot";
import { deleteLotRouter } from "./routes/lot/delete-lot";
import { addItemsRouter } from "./routes/lot/add-items";
import { showLotRouter } from "./routes/lot/show-lot";
import { listLotRouter } from "./routes/lot/list-lot";

import { createPriceRouter } from "./routes/price/create-price";
import { deletePriceRouter } from "./routes/price/delete-price";
import { updatePriceRouter } from "./routes/price/update-price";
import { showPriceRouter } from "./routes/price/show-price";
import { listPriceRouter } from "./routes/price/list-price";

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

app.use(createArticleRouter);
app.use(updateArticleRouter);
app.use(deleteArticleRouter);
app.use(showArticleRouter);
app.use(listArticlesRouter);

app.use(createLotRouter);
app.use(deleteLotRouter);
app.use(addItemsRouter);
app.use(showLotRouter);
app.use(listLotRouter);

app.use(createPriceRouter);
app.use(deletePriceRouter);
app.use(updatePriceRouter);
app.use(showPriceRouter);
app.use(listPriceRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

// catch errors
app.use(errorHandler);

export { app };
