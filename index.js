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

app.use(express.static("public")); // to read static files (css, js, img)
app.use(express.json()); // to read req.body
app.use(express.urlencoded({ extended: true })); // to read req.body
app.use(cookieParser());
app.set("view engine", "ejs"); // to set view engine to ejs


app.use('/', registrationRoutes);
app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/purchases', purchaseRoutes);

app.listen(port, () => {
  connectDB();
  console.log(`Example app listening on port ${port}`);
});
