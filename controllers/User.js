import User from "../models/User.js";
import Car from "../models/Car.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ errMsg: error.message });
	}
};

const getUsers = async (req, res) => {
	try {
		const users = await User.find();
		res.status(200).json(users);
	} catch (error) {
		res.status(404).json({ err: error.message });
	}
};

const deletePurchase = async (req, res) => {
	try {
	  const { id, purchaseId } = req.params;
	  const user = await User.findById(id);
  
	  if (!user) {
		return res.status(404).send("User not found");
	  }
  
	  // Find and remove the specific purchase
	  const purchaseIndex = user.purchases.findIndex(
		(purchase) => purchase._id.toString() === purchaseId
	  );
  
	  if (purchaseIndex === -1) {
		return res.status(404).send("Purchase not found");
	  }
  
	  const purchase = user.purchases[purchaseIndex];

    const car = await Car.findById(purchase.carId);
    if (car) {
      car.quantity += 1; // Increment the car's quantity
      await car.save();
    } else {
      console.warn("Car associated with the purchase not found.");
    }
