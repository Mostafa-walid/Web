import express from "express";
import Car from "../models/Car.js";
import User from "../models/User.js";

import { signIn_get, signIn_post } from "../controllers/registration/signin.js";
import { signUp_get, signUp_post } from "../controllers/registration/signUp.js";

const router = express.Router();

router.get("/", async (req, res) => {
	res.render("index", { user: null, cars: await Car.find().limit(4) });
});

router.get("/cars", async (req, res) => {
	const page = parseInt(req.query.page) || 1; 
	const limit = parseInt(req.query.limit) || 2; 
  
	const carsCount = await Car.countDocuments(); 
	const totalPages = Math.ceil(carsCount / limit); 
  
	
	const currentPage = Math.min(page, totalPages);
  
	
	const cars = await Car.find()
	  .skip((currentPage - 1) * limit) 
	  .limit(limit); 
  
	res.render("cars", {
	  user: null,
	  cars: cars,
	  currentPage: currentPage, 
	  totalPages: totalPages, 
	});
});

router.get("/cars-details/:id", async (req, res) => {
	res.render("carDetail", {
		user: false,
		car: await Car.findById(req.params.id),
	});
});
router.get("/user/:userId", async (req, res) => {
	res.render("index", {
		user: await User.findById(req.params.userId),
		cars: await Car.find().limit(4),
	});
});

router.get("/user/:userId/profile", async (req, res) => {
	try {
		const user = await User.findById(req.params.userId).select(
			"-purchases -password"
		);

		if (!user) {
			return res.status(404).send("User not found");
		}

		res.render("profile", { user });
	} catch (error) {
		console.error(error);
		res.status(500).send("Server error");
	}
});

router.get("/user/:userId/cars", async (req, res) => {
	const userId = req.params.userId;
	const page = parseInt(req.query.page) || 1; 
	const limit = parseInt(req.query.limit) || 2; 
  
	const carsCount = await Car.countDocuments(); 
	const totalPages = Math.ceil(carsCount / limit);   

	const currentPage = Math.min(page, totalPages);
  

	const cars = await Car.find()
	  .skip((currentPage - 1) * limit) 
	  .limit(limit); 
  
	res.render("cars", {
	  user: await User.findById(userId),
	  cars: cars,
	  currentPage: currentPage, 
	  totalPages: totalPages, 
	});
  });
router.get("/user/:userId/cars-details/:carId", async (req, res) => {
	res.render("carDetail", {
		user: await User.findById(req.params.userId),
		car: await Car.findById(req.params.carId),
	});
});

router.get("/user/:userId/cars-details/:carId/purchase", async (req, res) => {
	res.render("purchase", {
		user: await User.findById(req.params.userId),
		car: await Car.findById(req.params.carId),
	});
});

router.get("/signin", signIn_get);
router.post("/signin", signIn_post);

router.get("/signup", signUp_get);
router.post("/signup", signUp_post);

router.get("/logout", (req, res) => {
	res.cookie("jwt", "", { maxAge: 1 });
	res.redirect("/");
});

export default router;
