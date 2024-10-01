import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    score: {
      type: Number,
      default: 0, // Default score is 0
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparedPasswords = async function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

userSchema.methods.updateScore = async function (points) {
  this.score += points;
  await this.save();
};

const User = mongoose.model("User", userSchema);

export default User;
