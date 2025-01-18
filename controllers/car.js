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
const deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ errMsg: "Car not found" });
    }

    await Car.findByIdAndDelete(id);

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errMsg: error });
  }
};
const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getCarById = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateCar = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No car with id: ${id}`);

  const updatedCar = await Car.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedCar) {
    return res.status(404).json({ errMsg: "Car not found" });
  }

  return res.status(200).json({ updatedCar });
};

export { createCar, uploadImage, getCars, getCarById, updateCar, deleteCar };
