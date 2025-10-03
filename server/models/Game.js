import mongoose from "mongoose";

const adminActionSchema = {
  adminId: mongoose.Schema.Types.ObjectId,
  adminName: String,
  adminEmail: String,
};

const gameSchema = new mongoose.Schema(
  {
    gameName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    gamePoints: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: adminActionSchema,
    updatedBy: {
      ...adminActionSchema,
      updatedAt: Date,
    },
    deactivatedBy: {
      ...adminActionSchema,
      deactivatedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Game", gameSchema);
