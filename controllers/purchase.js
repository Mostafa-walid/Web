import Purchase from "../models/Purchase.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import mongoose from "mongoose";

const createPurchase = async (req, res) => {
  const userId = req.params.userId;
  const { amountPaid, purchaseType } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const cart = user.cart;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ errMsg: "Cart is empty" });
  }

  let totalPrice = 0;

  try {
    
    for (const item of cart) {
      const car = await Car.findById(item.carId);
      if (!car || car.quantity < item.quantity) {
        return res
          .status(400)
          .json({ error: `Not enough quantity for car ${car.model}` });
      } else {
        totalPrice += car.price * item.quantity;
      }
    }

   
    const purchase = new Purchase({
      userId,
      cart,
      totalPrice,
      amountPaid,
      purchaseType,
    });

    // Update car quantities
    for (const item of cart) {
      const car = await Car.findById(item.carId);
      car.quantity -= item.quantity;
      await car.save();
    }

   
    user.cart = [];
    await user.save();

    await purchase.save();
    return res.status(201).json({ purchase });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errMsg: "Internal server error" });
  }
};

const getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(404).json({ errMsg: error.message });
  }
};

const getPurchaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await Purchase.findById(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updatePurchase = async (req, res) => {
  const { id } = req.params;
  const { userId, carId, time, purchaseType } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No purchase with id: ${id}`);

  const updatedPurchase = { userId, carId, time, purchaseType, _id: id };

  await Purchase.findByIdAndUpdate(id, updatedPurchase, { new: true });

  res.json(updatedPurchase);
};

const deletePurchase = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No purchase with id: ${id}`);

  await Purchase.findByIdAndDelete(id);

  res.json({ message: "Purchase deleted successfully" });
};

export {
  createPurchase,
  getPurchases,
  getPurchaseById,
  updatePurchase,
  deletePurchase,
};
