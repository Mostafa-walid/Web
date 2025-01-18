import express from "express";
import multer from "multer";
import path from "path";
import {
	createCar,
	uploadImage,
	getCars,
	getCarById,
	updateCar,
	deleteCar,
} from "../controllers/car.js";

const router = express.Router();

// Set storage engine
const storage = multer.diskStorage({
	destination: "./public/img",
	filename: function (req, file, cb) {
		cb(
			null,
			file.fieldname + "-" + Date.now() + path.extname(file.originalname)
		);
	},
});

// Initialize upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000000000 }, // Limit file size to 1MB
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	},
}).single("image");

function checkFileType(file, cb) {

	const filetypes = /jpeg|jpg|png|gif|webp/;

	const extname = filetypes.test(
		path.extname(file.originalname).toLowerCase()
	);

	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("Error: Images Only!");
	}
}

router.post("/upload", upload, uploadImage);

router.post("/", createCar);

router.get("/:id", getCarById);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);

export default router;
