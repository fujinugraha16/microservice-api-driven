import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  if (!process.env.STOCK_API_URI) {
    throw new Error("STOCK_API_URI must be defined");
  }

  if (!process.env.CLOTH_API_URI) {
    throw new Error("CLOTH_API_URI must be defined");
  }

  try {
    // mongoose
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb ...");
  } catch (err) {
    console.log(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000 ...");
  });
};

start();
