import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      validate: [validator.isEmail, "Provide a valid Email"],
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required"],
    },
    purchases: [
      {
        country: {
          type: String,
        },
        city: {
          type: String,
        },
        streetAddress: {
          type: String,
        },
        carId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Car",
          required: true,
        },
        purchaseType: {
          type: String,
          enum: ["cash", "installments"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.skipHashing) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});


const User = mongoose.model("User", userSchema);

export default User;
