const mongoose = require("mongoose");

const missionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    place: { type: String, required: true },
    hour: { type: String, required: true },
    dateStart: { type: String, required: true },
    dateEnd: { type: String, required: true },
    agentLogistique: { type: String,required: true },
    status: { type: String,default: "attend" },
    
  },
  { timestamps: true }
);

const missionModel = mongoose.model("missions", missionSchema);

module.exports = missionModel;
