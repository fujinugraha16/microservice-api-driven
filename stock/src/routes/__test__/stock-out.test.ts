import request from "supertest";
import { app } from "../../app";

// models
import { Stock } from "../../models/stock";

// constants
import { DesignPayload, randomString } from "@fujingr/common";

// helpers
import { createStock } from "../../helpers/stock-test";

const articleId = randomString(12);
const qrCode = randomString(5);
const itemId = randomString(12);

test("stock in successfully", async () => {
  const stock = await createStock(articleId, itemId, qrCode);

  const article = {
    id: articleId,
    name: "Toyobo",
  };
  const designs: DesignPayload[] = [
    {
      color: "#fff",
      name: "Test White",
      items: [
        {
          id: itemId,
          lengthInMeters: 40,
          lengthInYards: 40 * 1.09,
          qrCode,
        },
      ],
    },
  ];

  await request(app)
    .post("/api/stock/out")
    .send({ article, designs })
    .expect(200);

  const existingStock = await Stock.findOne({
    article: articleId,
    color: "#fff",
  });
  expect(existingStock!.totalQty).toEqual(stock!.totalQty - 1);
  expect(existingStock!.totalLengthInMeters).toEqual(
    stock!.totalLengthInMeters - 40
  );
  expect(existingStock!.detailStocks.length).toEqual(0);
});
