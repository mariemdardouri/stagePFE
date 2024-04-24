const mongoose = require("mongoose");

const materielSchema = new mongoose.Schema(
  {
    categorie: { type: String, required: true },
    nature: { type: String, required: true },
    numero: { type: String, required: true },
  },
  { timestamps: true }
);

const materielModel = mongoose.model("materiels", materielSchema);

module.exports = materielModel;