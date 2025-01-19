import User from "../models/User.js";
import Car from "../models/Car.js";

const homePage = async (req, res) => {
	res.redirect(`/admin/${req.params.userId}/cars`);
};

const usersPage = async (req, res) => {
	res.render("admin/users", {
		user: await User.findById(req.params.userId),
		users: await User.find(),
	});
};
const editUserPage = async (req, res) => {
	try {
		res.render("admin/editUser", {
			user: await User.findById(req.params.userId),
			targetUser: await User.findById(req.params.targetUserId),
		});
	} catch (error) {
		console.error("Error in editUserPage:", error);

		res.status(500).send("Server error");
	}
};
const updateUser = async (req, res) => {
	const { role, username, email, password } = req.body;
	const { targetUserId } = req.params;

	try {
		const user = await User.findById(targetUserId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.role = role;
		user.username = username;
		user.email = email;

		if (password) {
			user.password = password;
		}

		await user.save();
		res.status(200).json({ message: "User updated successfully!" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while updating the user" });
	}
};

const orderPage = async (req, res) => {
	try {
		const usersWithPurchases = await User.find({
			"purchases.0": { $exists: true },
		})
			.populate("purchases.carId", "type model price")
			.select("name email purchases");
		res.render("admin/orders", {
			user: await User.findById(req.params.userId),
			usersWithPurchases,
		});
	} catch (error) {
		console.error("Error fetching orders:", error);
		res.status(500).send("Server error");
	}
};
const userDetailsPage = async (req, res) => {
	res.render("admin/userDetails", {
		user: await User.findById(req.params.userId),
		targetUser: await User.findById(req.params.targetUserId),
	});
};

const carsPage = async (req, res) => {
	res.render("admin/cars", {
		user: await User.findById(req.params.userId),
		cars: await Car.find(),
	});
};

const addCarPage = async (req, res) => {
	res.render("admin/addCar", {
		user: await User.findById(req.params.userId),
	});
};

const editeCarPage = async (req, res) => {
	res.render("admin/editeCar", {
		user: await User.findById(req.params.userId),
		car: await Car.findById(req.params.carId),
	});
};

const getEditPurchasePage = async (req, res) => {
	try {
		const { userId, purchaseId } = req.params;

		// Find the user and fetch the specific purchase
		const user = await User.findById(userId).populate("purchases.carId");
		if (!user) {
			return res.status(404).send("User not found");
		}

		const purchase = user.purchases.find(
			(p) => p._id.toString() === purchaseId
		);
		if (!purchase) {
			return res.status(404).send("Purchase not found");
		}

		// Render the edit page with the purchase data
		res.render("admin/editPurchase", { user, purchase });
	} catch (error) {
		console.error("Error fetching purchase for edit:", error);
		res.status(500).send("Server error");
	}
};

const updatePurchase = async (req, res) => {
	try {
		const { userId, purchaseId } = req.params;
		const { country, city, streetAddress, purchaseType } = req.body;

		// Find the user and update the specific purchase
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send("User not found");
		}

		const purchase = user.purchases.find(
			(p) => p._id.toString() === purchaseId
		);
		if (!purchase) {
			return res.status(404).send("Purchase not found");
		}

		// Update the purchase details
		purchase.country = country;
		purchase.city = city;
		purchase.streetAddress = streetAddress;
		purchase.purchaseType = purchaseType;

		await user.save();

		res.status(200).json({ message: "Purchase updated successfully" });
	} catch (error) {
		console.error("Error updating purchase:", error);
		res.status(500).json({ error: "Server error" });
	}
};
const deletePurchase = async (req, res) => {
	try {
		const { userId, purchaseId } = req.params;

		// Find the user
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).send("User not found");
		}

		// Find the purchase to be deleted
		const purchase = user.purchases.find(
			(p) => p._id.toString() === purchaseId
		);
		if (!purchase) {
			return res.status(404).send("Purchase not found");
		}

		// Find the associated car and increment its quantity
		const car = await Car.findById(purchase.carId); // Assuming `carId` is stored in the purchase object
		if (!car) {
			return res.status(404).send("Car not found");
		}
		car.quantity += 1; // Increment the car's quantity
		await car.save();

		// Remove the purchase from the user's purchases
		user.purchases = user.purchases.filter(
			(p) => p._id.toString() !== purchaseId
		);
		await user.save();

		res.status(200).json({ message: "Purchase deleted and car quantity updated successfully" });
	} catch (error) {
		console.error("Error deleting purchase:", error);
		res.status(500).json({ error: "Server error" });
	}
};


const getAddUserPage = async (req, res) => {
	try {
		const adminId = req.params.userId;
		res.render("admin/addUser", { adminId });
	} catch (error) {
		console.error("Error rendering Add User page:", error);
		res.status(500).send("Server error");
	}
};

const addUser = async (req, res) => {
	try {
		const { name, username, email, password, role } = req.body;

		const newUser = new User({ name, username, email, password, role });
		await newUser.save();

		res.status(200).json({ message: "User added successfully!" });
	} catch (error) {
		console.error("Error adding user:", error);
		res.status(500).json({ error: "Failed to add user" });
	}
};
export {
	getAddUserPage,
	addUser,
	homePage,
	usersPage,
	userDetailsPage,
	carsPage,
	addCarPage,
	editeCarPage,
	editUserPage,
	updateUser,
	orderPage,
	getEditPurchasePage,
	updatePurchase,
	deletePurchase,
};
