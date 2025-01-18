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
 user.purchases.splice(purchaseIndex, 1);
    await user.save();

    res.status(200).send("Purchase deleted and car quantity updated successfully.");
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).send("Server error");
  }
  };

const getOrderHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user and populate purchase details
    const user = await User.findById(id).populate("purchases.carId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ purchases: user.purchases });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserById = async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.render("index", { user, cars: await Car.find() });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const updatedUser = await User.findByIdAndUpdate(id, updates, {
			new: true,
			runValidators: true,
		});

		if (!updatedUser) {
			return res.status(404).json({ errMsg: "User not found" });
		}
	const user = updatedUser;
		res.render("profile", { user });
	} catch (error) {
		console.error(error);
		res.status(500).json({ errMsg: "Server error", error });
	}
};

const updatePassword = async (req, res) => {
	try {
	  const { id } = req.params;
	  const { currentPassword, newPassword, confirmPassword } = req.body;
  
	  // Validate the user exists
	  const user = await User.findById(id);
	  if (!user) {
		console.log(`User not found for ID: ${id}`);
		return res.status(404).send("User not found");
	  }
  
	  // Validate current password
	  const isMatch = await bcrypt.compare(currentPassword, user.password);
	  if (!isMatch) {
		return res.status(400).send("Current password is incorrect");
	  }
  
	  // Validate new passwords match
	  if (newPassword !== confirmPassword) {
		return res.status(400).send("New passwords do not match");
	  }
  
	  // Hash the new password
	  const salt = await bcrypt.genSalt();
	  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
	  // Update password directly
	  const updatedUser = await User.findByIdAndUpdate(
		id,
		{ password: hashedPassword },
		{ new: true, runValidators: true }
	  );

	  res.render("profile", { user: updatedUser });
	} catch (error) {
	  console.error(error);
	  res.status(500).send("Server error");
	}
  };
  
// Get User Profile with Order History
const getUserProfile = async (req, res) => {
	try {
		const { userId } = req.params;

		// Fetch user and populate purchases
		const user = await User.findById(userId).populate("purchases.carId");

		if (!user) {
			return res.status(404).send("User not found");
		}

		res.render("profile", { user });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
};

const purchaseCar = async (req, res) => {
	const userId = req.params.id;
	const { purchaseDetails } = req.body;

	const car = await Car.findById(purchaseDetails.carId);
	if (car.quantity == 0)
		return res
			.status(500)
			.json({ errMsg: "Car out of stock .. try again later" });
	else car.quantity--;
	car.save();

	try {
		const user = await User.findById(userId);
		console.log(user);
		if (!user.purchases) user.purchases = [];
		user.purchases.push(purchaseDetails);
		user.save();
		res.status(200).json({ user });
	} catch (err) {
		res.status(500).json({ errMsg: err.message });
	}
};

const deleteUser = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id))
		return res.status(404).send(`No user with id: ${id}`);

	await User.findByIdAndDelete(id);

	res.json({ message: "User deleted successfully" });
};

export {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	purchaseCar,
	deleteUser,
	getUserProfile,
	updatePassword,
	getOrderHistory,
	deletePurchase,
};
