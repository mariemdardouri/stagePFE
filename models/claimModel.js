const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    materiel: { type: mongoose.Schema.Types.ObjectId, ref: 'materiels', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    description: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const claimModel = mongoose.model("claims", claimSchema);

module.exports = claimModel;
