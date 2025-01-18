import User from "../../models/User.js";

export const signUp_get = async (req, res) => {
  res.render("registration/signUp");
};

export const signUp_post = async (req, res) => {

  let newUser;
  try {
    const { name, username, password, email } = req.body;

    if (await User.findOne({ email }))
      return res.status(409).json({ errMsg: "Email is Taken" });

    if (await User.findOne({ username }))
      return res.status(409).json({ errMsg: "Username is Taken" });

    newUser = new User({
      name,
      username,
      password,
      email,
    });

    await newUser.save();
  } catch (err) {
    return res.status(409).json({ errMsg: err });
  }

  return res.status(201).json({ user: newUser });
};
