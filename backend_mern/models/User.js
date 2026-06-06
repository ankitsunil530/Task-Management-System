import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password || !enteredPassword) {
    return false;
  }

  // Support legacy users whose passwords may have been stored in plain text
  // before hashing was added. If the stored value is not a bcrypt hash, fall
  // back to a direct comparison and upgrade it to a hash on first successful
  // login so future logins use the secure path.
  const isBcryptHash = typeof this.password === "string" && this.password.startsWith("$2");

  if (isBcryptHash) {
    return await bcrypt.compare(enteredPassword, this.password);
  }

  const matchesLegacyPassword = enteredPassword === this.password;
  if (matchesLegacyPassword) {
    const upgradedPassword = await bcrypt.hash(enteredPassword, 10);
    await this.constructor.updateOne(
      { _id: this._id },
      { $set: { password: upgradedPassword } }
    );
    this.password = upgradedPassword;
  }

  return matchesLegacyPassword;
};

const User = mongoose.model("User", userSchema);
export default User;
