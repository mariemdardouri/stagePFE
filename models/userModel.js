const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    cin: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    role: { type: String },
    status: { type: String, default: "pending" },
    seenNotifications:{ type: Array, default: [] },
    unseenNotifications:{ type: Array, default: [] },
  },
  { timestamps: true }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
