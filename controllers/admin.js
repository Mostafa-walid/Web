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
