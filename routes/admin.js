import express from "express";

import {
	homePage,
	usersPage,
	userDetailsPage,
	editUserPage,
	updateUser,
	carsPage,
	addCarPage,
	editeCarPage,
	orderPage,
	getEditPurchasePage,
	updatePurchase,
	deletePurchase,
	getAddUserPage,
	addUser,
} from "../controllers/admin.js";

const router = express.Router();

router.get("/:userId", homePage);
router.get("/:userId/users", usersPage);
router.get("/:userId/user/:targetUserId", userDetailsPage);
router.get("/:userId/add-user", getAddUserPage);
router.post("/:userId/add-user", addUser);
router.get("/:userId/edit-user/:targetUserId", editUserPage);
router.put("/:userId/users/:targetUserId", updateUser);

router.get("/:userId/orders", orderPage);
router.get("/:userId/cars", carsPage);
router.get("/:userId/add-car", addCarPage);
router.get("/:userId/cars/:carId", editeCarPage);

router.get("/:userId/edit-purchase/:purchaseId", getEditPurchasePage);
router.put("/:userId/edit-purchase/:purchaseId", updatePurchase);
router.delete("/:userId/delete-purchase/:purchaseId", deletePurchase);

export default router;
