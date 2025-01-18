import dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  db_url: process.env.MONGO_URL,
  jwt_secret_phrase: process.env.JWT_SECRET_PHRASE,
  sslCertPath: process.env.SSLCERTPATH, // Path to your SSL certificate
  sslKeyPath: process.env.SSLKEYPATH, // Path to your SSL key
};
