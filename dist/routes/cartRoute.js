"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartContoller_1 = require("../controllers/cartContoller");
const router = express_1.default.Router();
router.post("/createCartItemForUser", cartContoller_1.createCartItemsForUser);
router.post("/getCartItemsForUser", cartContoller_1.getCartItemsForUser);
router.post("/updateCartItem", cartContoller_1.updateCartItem);
router.post("/deleteCartItem", cartContoller_1.deleteCartItem);
exports.default = router;
