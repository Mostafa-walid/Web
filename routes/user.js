import express from "express";
import {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	purchaseCar,
	deleteUser,
	updatePassword,
	getOrderHistory,
	deletePurchase,
} from "../controllers/user.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/:id/update", updateUser);
router.post("/:id/update-password", updatePassword);
router.get("/order-history/:id", getOrderHistory);
router.delete("/order-history/:id/:purchaseId", deletePurchase);
router.put("/:id/purchase", purchaseCar);
router.delete("/:id", deleteUser);

export default router;

