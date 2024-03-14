"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const productRoute_1 = __importDefault(require("../routes/productRoute"));
const categoryRoute_1 = __importDefault(require("../routes/categoryRoute"));
const userRoute_1 = __importDefault(require("../routes/userRoute"));
const cartRoute_1 = __importDefault(require("../routes/cartRoute"));
const paymentRouter_1 = __importDefault(require("../routes/paymentRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
const cors = require("cors");
app.use(cors());
app.use(express_1.default.json());
app.use("/api/products", productRoute_1.default);
app.use("/api/categories", categoryRoute_1.default);
app.use("/api/user", userRoute_1.default);
app.use("/api/cart", cartRoute_1.default);
app.use("/api/payment", paymentRouter_1.default);
app.get("/", (req, res) => {
    res.send("hi there :)");
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
