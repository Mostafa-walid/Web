import Car from "../models/Car.js";
import mongoose from "mongoose";

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createCar = async (req, res) => {
  const carData = req.body;
  try {
    const newCar = new Car(carData);
    await newCar.save();
    res.json({ message: "Car added successfully" });
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
};

const uploadImage = async (req, res) => {
  const imageUrl = "/img/" + req.file.filename;
  res.json({ imageUrl });
};
