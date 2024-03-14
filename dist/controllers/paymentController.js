"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
    throw new Error("Stripe secret key is not defined.");
}
const stripeClient = new stripe_1.default(stripeSecretKey);
const paymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { products } = req.body;
    try {
        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid products data" });
        }
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: product.name,
                    images: [product.thumbnail],
                },
                unit_amount: product.price * 100,
            },
            quantity: product.quantity,
        }));
        const session = yield stripeClient.checkout.sessions.create({
            shipping_address_collection: { allowed_countries: ["IN"] },
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });
        res.status(200).json({ sessionId: session.id });
    }
    catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.paymentController = paymentController;
