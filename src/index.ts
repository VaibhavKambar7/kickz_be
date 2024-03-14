import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

import productRoute from "../routes/productRoute";
import categoryRoute from "../routes/categoryRoute";
import userRoute from "../routes/userRoute";
import cartRoute from "../routes/cartRoute";
import paymentRoute from "../routes/paymentRouter";

const app: Express = express();
const port = process.env.PORT || 3001;

const cors = require("cors");
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/user", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/payment", paymentRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("hi there :)");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
