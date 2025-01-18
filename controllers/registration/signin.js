import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import secrets from "../../config/secrets.js";
import bcrypt from "bcrypt"
const { jwt_secret_phrase } = secrets;

export const signIn_get = async (req, res) => {
  res.render("registration/signin");
};

export const signIn_post = async (req, res) => {
  const { username, password } = req.body;

  try {
    const founduser = await User.findOne({ username });

    if (!founduser)
      return res.status(401).json({ errMsg: "Wrong username or password" });

    const isValid = await bcrypt.compare(password, founduser.password);
    
    if (!isValid)
      return res.status(401).json({ errMsg: "Wrong username or password" });

    const token = jwt.sign({ user: founduser }, jwt_secret_phrase, {
      expiresIn: 3 * 24 * 60 * 60, //3 days
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
    });

    res.status(200).json({ user: founduser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errMsg: err });
  }
};
