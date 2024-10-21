import express, { Request, Response } from "express";
import mongoose from "mongoose";

const app = express();
app.use(express.json());

// eslint-disable-next-line prefer-destructuring
const DB = process.env.DB;
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    // eslint-disable-next-line no-console
    console.log("mongodb is connected");
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
  });
app.use(express.static(`${__dirname}/public`));

// // // 3) ROUTES
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ stats: "s" });
});
// 4) START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});
