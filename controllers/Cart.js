import User from "../models/User.js";

export const addItemToCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    const { carId, quantity } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errMsg: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.carId.toString() === carId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ carId, quantity });
    }

    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { carId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errMsg: "User not found" });
    }

    user.cart = user.cart.filter(
      (item) => item.carId.toString() !== carId
    );
    await user.save();
    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
};

export const updateItemQuantityInCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { carId, quantity } = req.body;
    const user = await User.findById(userId);
   if (!user) {
      return res.status(404).json({ errMsg: "User not found" });
    }

    const cartItem = user.cart.find(
      (item) => item.carId.toString() === carId
    );

    if (cartItem) {
      cartItem.quantity = quantity;
      await user.save();
      res.status(200).json(user.cart);
    } else {
      res.status(404).json({ errMsg: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ errMsg: "User not found" });
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
};
