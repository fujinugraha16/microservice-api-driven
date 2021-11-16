import request from "supertest";
import { app } from "../../../app";

// models
import { Stock } from "../../../models/stock";

// constants
import { DesignPayload, randomString } from "@fujingr/common";

const articleId = randomString(12);

test("stock in successfully", async () => {
  const article = {
    id: articleId,
    name: "Toyobo",
  };
  const designs: DesignPayload[] = [
    {
      color: "#fff",
      name: "White",
      items: [
        {
          id: randomString(12),
          lengthInMeters: 40,
          lengthInYards: 40 * 1.09,
          qrCode: randomString(5),
        },
      ],
    },
  ];

  await request(app)
    .post("/api/stock/in")
    .send({ article, designs })
    .expect(200);

  const stock = await Stock.findOne({ article: articleId, color: "#fff" });
  expect(stock!.totalLengthInMeters).toEqual(40);
  expect(stock!.totalQty).toEqual(1);
  expect(stock!.inOutStocks.length).toEqual(1);
  expect(stock!.detailStocks.length).toEqual(1);
});
