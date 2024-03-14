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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCartItem = exports.updateCartItem = exports.getCartItemsForUser = exports.createCartItemsForUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCartItemsForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matchedProduct, selectedSize, quantity, userEmail } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const createdCartItem = yield prisma.cartItem.create({
            data: {
                user: {
                    connect: {
                        id: user.id,
                    },
                },
                name: matchedProduct.name,
                price: matchedProduct.price,
                subtitle: matchedProduct.subtitle,
                size: matchedProduct.size,
                thumbnail: matchedProduct.thumbnail,
                selectedSize,
                quantity,
            },
        });
        return res.status(201).json(createdCartItem);
    }
    catch (error) {
        console.error("Error creating cart item:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.createCartItemsForUser = createCartItemsForUser;
const getCartItemsForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: userEmail,
            },
            include: {
                cartItems: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const cartItems = user.cartItems;
        return res.status(200).json(cartItems);
    }
    catch (error) {
        console.error("Error fetching cart items:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCartItemsForUser = getCartItemsForUser;
const updateCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { matchedProduct, selectedSize, quantity, userEmail } = req.body;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: userEmail,
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const existingCartItem = yield prisma.cartItem.findFirst({
            where: { userId: user.id, name: matchedProduct.name, selectedSize },
        });
        if (!existingCartItem) {
            return res.status(404).json({ error: "Cart item not found" });
        }
        const updatedCartItem = yield prisma.cartItem.update({
            where: {
                id: existingCartItem.id,
            },
            data: {
                quantity: existingCartItem.quantity + quantity,
                price: matchedProduct.price * (existingCartItem.quantity + quantity),
            },
        });
        return res.status(200).json(updatedCartItem);
    }
    catch (error) {
        console.error("Error updating cart item:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateCartItem = updateCartItem;
const deleteCartItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    try {
        const item = yield prisma.cartItem.delete({
            where: {
                id: parseInt(id),
            },
        });
        return res.status(200).json(item);
    }
    catch (error) {
        console.error("Error deleting cart item:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteCartItem = deleteCartItem;
