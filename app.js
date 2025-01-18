import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import secrets from "./config/secrets.js";
const { port } = secrets;
import connectDB from "./config/db.js";
import fs from 'fs';
import https from 'https';


//routers
import homeRoutes from "./routes/home.js";
import userRoutes from "./routes/user.js";
import adminRoutes from "./routes/admin.js";
import carRoutes from "./routes/car.js";
import adminAuth from "./middlewares/adminAuth.js";


const sslOptions = {
	key: fs.readFileSync(secrets.sslKeyPath),   // Read the SSL private key from the path
	cert: fs.readFileSync(secrets.sslCertPath), // Read the SSL certificate from the path
  };
  
app.use(express.static("public")); // to read static files (css, js, img)
app.use(express.json()); // to read req.body
app.use(express.urlencoded({ extended: true })); // to read req.body
app.use(cookieParser());
app.set("view engine", "ejs"); // to set view engine to ejs

app.use("/", homeRoutes);
app.use("/users", userRoutes);
app.use("/admin", adminAuth, adminRoutes);
app.use("/cars", carRoutes);

https.createServer(sslOptions, app).listen(port, () => {
	connectDB();
	console.log(`Server running on https://localhost:${port}`);
  });
