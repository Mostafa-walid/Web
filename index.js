import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import secrets from "./config/secrets.js";
const { port } = secrets;
import connectDB from "./config/db.js";

//routers
import registrationRoutes from './routes/registration.js';
import userRoutes from './routes/user.js';
import carRoutes from './routes/car.js';
import purchaseRoutes from './routes/purchase.js';

