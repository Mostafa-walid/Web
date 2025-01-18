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
