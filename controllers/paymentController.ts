import { Request, Response } from "express";
import stripe from "stripe";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined.");
}

const stripeClient = new stripe(stripeSecretKey);

export const paymentController = async (req: Request, res: Response) => {
  const { products } = req.body;

  try {
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "Invalid products data" });
    }

    const lineItems = products.map((product: any) => ({
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

    const session = await stripeClient.checkout.sessions.create({
      shipping_address_collection: { allowed_countries: ["IN"] },
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
