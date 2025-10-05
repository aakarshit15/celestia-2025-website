import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    leaderName: {
      type: String,
      required: true,
      trim: true,
    },
    leaderEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: true,
      trim: true,
    },
    teamId: {
      type: Number,
      required: true,
      unique: true,
    },
    teamSize: {
      type: Number,
      default: 1,
      required: true,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
    gameProgress: [
      {
        gameId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Game",
        },
        points: {
          type: Number,
          default: 0,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        assignedBy: {
          adminId: mongoose.Schema.Types.ObjectId,
          adminName: String,
          adminEmail: String,
        },
      },
    ],
    pointsBet: {
      type: Number,
      default: 0,
    },
    qrCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Participant", participantSchema);
