import express from "express";

import { signIn_get, signIn_post } from "../controllers/registration/signin.js";
import { signUp_get, signUp_post } from "../controllers/registration/signUp.js";

const router = express.Router();

router.get("/signin", signIn_get);
router.post("/signin", signIn_post);

router.get("/signup", signUp_get);
router.post("/signup", signUp_post);

router.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

export default router;
