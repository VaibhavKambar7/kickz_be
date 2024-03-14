import express, { Router } from "express";
import {
  createCartItemsForUser,
  getCartItemsForUser,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartContoller";

const router: Router = express.Router();

router.post("/createCartItemForUser", createCartItemsForUser);
router.post("/getCartItemsForUser", getCartItemsForUser);
router.post("/updateCartItem", updateCartItem);
router.post("/deleteCartItem", deleteCartItem);

export default router;
