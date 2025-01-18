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
