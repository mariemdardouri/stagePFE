  const mongoose = require("mongoose");

  const materielSchema = new mongoose.Schema(
    {
      categorie: { type: String },
      nature: { type: String },
      numSerie: { type: String},
      numInv: { type: String, default: ''},
      status: { type: String, default: 'pending' },
      agent: { type: String,default:'' },
      fournisseur: { type: String},
    },
    { timestamps: true }
  );

  const materielModel = mongoose.model("materiels", materielSchema);

  module.exports = materielModel;
