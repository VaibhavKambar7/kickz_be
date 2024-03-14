import express, { Router } from "express";
import { paymentController } from "../controllers/paymentController";

const router = Router();

router.post("/create-checkout-session", paymentController);

export default router;
