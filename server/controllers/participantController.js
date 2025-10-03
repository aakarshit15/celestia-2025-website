import { Participant } from "../models/index.js";
import {
  formatResponse,
  handleError,
  generateTeamId,
  validateEmail,
} from "../utils/helpers.js";
import {
  generateQRCode,
  sendRegistrationEmail,
} from "../utils/emailService.js";

export const registerParticipant = async (req, res) => {
  try {
    const { teamName, leaderName, leaderEmail } = req.body;

    // Validation
    if (!teamName || !leaderName || !leaderEmail) {
      return res
        .status(400)
        .json(formatResponse(null, "All fields are required", 400));
    }

    if (!validateEmail(leaderEmail)) {
      return res
        .status(400)
        .json(formatResponse(null, "Invalid email format", 400));
    }

    // Check if email already exists
    const existingParticipant = await Participant.findOne({ leaderEmail });
    if (existingParticipant) {
      return res
        .status(409)
        .json(formatResponse(null, "Email already registered", 409));
    }

    // Generate unique team ID
    const teamId = generateTeamId();

    // Generate QR code
    const qrCode = await generateQRCode(teamId);

    // Create participant
    const participant = new Participant({
      leaderName,
      leaderEmail,
      teamName,
      teamId,
      qrCode,
    });

    await participant.save();

    // Send registration email
    await sendRegistrationEmail(leaderEmail, teamName, teamId, qrCode);

    res.status(201).json(
      formatResponse(
        {
          teamId,
          teamName,
          leaderName,
          leaderEmail,
        },
        "Registration successful! Check your email for QR code.",
        201
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};

export const getParticipantByTeamId = async (req, res) => {
  try {
    const { teamId } = req.params;

    const participant = await Participant.findOne({ teamId }).populate(
      "gameProgress.gameId",
      "gameName gamePoints"
    );

    if (!participant) {
      return res.status(404).json(formatResponse(null, "Team not found", 404));
    }

    res.json(formatResponse(participant, "Participant retrieved successfully"));
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find()
      .populate("gameProgress.gameId", "gameName gamePoints")
      .sort({ totalPoints: -1 });

    res.json(
      formatResponse(participants, "Participants retrieved successfully")
    );
  } catch (error) {
    handleError(error, res);
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Participant.find()
      .select("teamName leaderName totalPoints")
      .sort({ totalPoints: -1 })
      .limit(10);

    res.json(formatResponse(leaderboard, "Leaderboard retrieved successfully"));
  } catch (error) {
    handleError(error, res);
  }
};
