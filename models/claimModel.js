const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    materiel: { type: mongoose.Schema.Types.ObjectId, ref: 'materiels', required: true },
    description: { type: String, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

const claimModel = mongoose.model("claims", claimSchema);

module.exports = claimModel;
