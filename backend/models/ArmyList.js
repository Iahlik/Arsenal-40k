import mongoose from "mongoose";

const armyListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    faction: {
      type: String,
      required: true,
    },
    detachment: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      max: 3000,
    },
    listText: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ArmyList", armyListSchema);
