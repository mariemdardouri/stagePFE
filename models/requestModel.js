const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    cin: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    password: { type: String },
    role: { type: String },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const requestModel = mongoose.model("requests", requestSchema);

module.exports = requestModel;
