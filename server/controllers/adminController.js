import { Admin, Participant, Game } from "../models/index.js";
import { formatResponse, handleError } from "../utils/helpers.js";
import jwt from "jsonwebtoken";
// const mongoose = require("mongoose");
import mongoose from "mongoose";

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json(formatResponse(null, "Email and password are required", 400));
    }

    // Find admin
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res
        .status(401)
        .json(formatResponse(null, "Invalid credentials", 401));
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(formatResponse(null, "Invalid credentials", 401));
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: admin.role,
        name: admin.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json(
      formatResponse(
        {
          token,
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          },
        },
        "Login successful"
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};

// Create Admin (Only for initial setup or superadmin)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json(formatResponse(null, "All fields are required", 400));
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(409)
        .json(formatResponse(null, "Admin already exists", 409));
    }

    // Check admin limit (7 admins max)
    const adminCount = await Admin.countDocuments();
    if (adminCount >= 7) {
      return res
        .status(400)
        .json(formatResponse(null, "Maximum admin limit reached (7)", 400));
    }

    const admin = new Admin({
      name,
      email,
      password,
      role: role || "admin",
    });

    await admin.save();

    res.status(201).json(
      formatResponse(
        {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        "Admin created successfully",
        201
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(formatResponse(admins, "Admins retrieved successfully"));
  } catch (error) {
    handleError(error, res);
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");

    if (!admin) {
      return res.status(404).json(formatResponse(null, "Admin not found", 404));
    }

    res.json(formatResponse(admin, "Profile retrieved successfully"));
  } catch (error) {
    handleError(error, res);
  }
};

// Get admin activity logs
export const getAdminActivityLogs = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findById(adminId).select(
      "name email activityLog"
    );

    if (!admin) {
      return res.status(404).json(formatResponse(null, "Admin not found", 404));
    }

    res.json(
      formatResponse(
        {
          admin: {
            name: admin.name,
            email: admin.email,
          },
          activityLog: admin.activityLog.sort(
            (a, b) => b.timestamp - a.timestamp
          ),
        },
        "Activity logs retrieved successfully"
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};

// Deactivate admin
export const deactivateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { isActive: false },
      { new: true }
    ).select("-password");

    if (!admin) {
      return res.status(404).json(formatResponse(null, "Admin not found", 404));
    }

    res.json(formatResponse(admin, "Admin deactivated successfully"));
  } catch (error) {
    handleError(error, res);
  }
};

export const getAdminPointsHistory = async (req, res) => {
  try {
    const participants = await Participant.find()
      .populate("gameProgress.gameId", "gameName gamePoints description")
      .select("teamId teamName gameProgress");

    // Flatten game progress data
    let pointsHistory = [];

    participants.forEach((participant) => {
      participant.gameProgress.forEach((progress) => {
        pointsHistory.push({
          teamId: participant.teamId,
          teamName: participant.teamName,
          gameId: progress.gameId._id,
          gameName: progress.gameId.gameName,
          gamePoints: progress.gameId.gamePoints,
          pointsAwarded: progress.points,
          assignedAt: progress.completedAt,
          assignedBy: {
            adminId: progress.assignedBy?.adminId || null,
            adminName: progress.assignedBy?.adminName || "Unknown",
            adminEmail: progress.assignedBy?.adminEmail || null,
          },
        });
      });
    });

    // Sort by most recent first
    pointsHistory.sort(
      (a, b) => new Date(b.assignedAt) - new Date(a.assignedAt)
    );

    // Generate summary statistics
    const adminStats = {};
    const teamStats = {};
    const gameStats = {};

    pointsHistory.forEach((entry) => {
      const adminName = entry.assignedBy.adminName;
      const teamName = entry.teamName;
      const gameName = entry.gameName;

      // Admin statistics
      if (!adminStats[adminName]) {
        adminStats[adminName] = {
          adminName,
          totalPointsAssigned: 0,
          totalAssignments: 0,
          uniqueTeams: new Set(),
          uniqueGames: new Set(),
        };
      }
      adminStats[adminName].totalPointsAssigned += entry.pointsAwarded;
      adminStats[adminName].totalAssignments++;
      adminStats[adminName].uniqueTeams.add(entry.teamId);
      adminStats[adminName].uniqueGames.add(entry.gameId);

      // Team statistics
      if (!teamStats[entry.teamId]) {
        teamStats[entry.teamId] = {
          teamId: entry.teamId,
          teamName,
          totalPointsReceived: 0,
          totalGamesCompleted: 0,
          uniqueAdmins: new Set(),
          uniqueGames: new Set(),
        };
      }
      teamStats[entry.teamId].totalPointsReceived += entry.pointsAwarded;
      teamStats[entry.teamId].totalGamesCompleted++;
      teamStats[entry.teamId].uniqueAdmins.add(adminName);
      teamStats[entry.teamId].uniqueGames.add(entry.gameId);

      // Game statistics
      if (!gameStats[entry.gameId]) {
        gameStats[entry.gameId] = {
          gameId: entry.gameId,
          gameName,
          gamePoints: entry.gamePoints,
          totalPointsAwarded: 0,
          totalCompletions: 0,
          uniqueTeams: new Set(),
          uniqueAdmins: new Set(),
        };
      }
      gameStats[entry.gameId].totalPointsAwarded += entry.pointsAwarded;
      gameStats[entry.gameId].totalCompletions++;
      gameStats[entry.gameId].uniqueTeams.add(entry.teamId);
      gameStats[entry.gameId].uniqueAdmins.add(adminName);
    });

    // Convert Sets to counts and clean up data
    const adminSummary = Object.values(adminStats)
      .map((admin) => ({
        ...admin,
        uniqueTeams: admin.uniqueTeams.size,
        uniqueGames: admin.uniqueGames.size,
      }))
      .sort((a, b) => b.totalPointsAssigned - a.totalPointsAssigned);

    const teamSummary = Object.values(teamStats)
      .map((team) => ({
        ...team,
        uniqueAdmins: team.uniqueAdmins.size,
        uniqueGames: team.uniqueGames.size,
      }))
      .sort((a, b) => b.totalPointsReceived - a.totalPointsReceived);

    const gameSummary = Object.values(gameStats)
      .map((game) => ({
        ...game,
        uniqueTeams: game.uniqueTeams.size,
        uniqueAdmins: game.uniqueAdmins.size,
      }))
      .sort((a, b) => b.totalCompletions - a.totalCompletions);

    res.json(
      formatResponse(
        {
          pointsHistory,
          summary: {
            totalPointsAssigned: pointsHistory.reduce(
              (sum, entry) => sum + entry.pointsAwarded,
              0
            ),
            totalAssignments: pointsHistory.length,
            uniqueAdmins: adminSummary.length,
            uniqueTeams: teamSummary.length,
            uniqueGames: gameSummary.length,
          },
          statistics: {
            byAdmin: adminSummary,
            byTeam: teamSummary,
            byGame: gameSummary,
          },
        },
        "Points assignment history retrieved successfully"
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};

export const subtractPointsByQR = async (req, res) => {
  try {
    const { qrData, points, reason } = req.body;

    if (!qrData || !points) {
      return res
        .status(400)
        .json(
          formatResponse(null, "QR code data and points are required", 400)
        );
    }

    if (points <= 0) {
      return res
        .status(400)
        .json(formatResponse(null, "Points must be greater than 0", 400));
    }

    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (parseError) {
      return res
        .status(400)
        .json(formatResponse(null, "Invalid QR code format", 400));
    }

    const { teamId } = parsedData;

    if (!teamId) {
      return res
        .status(400)
        .json(formatResponse(null, "Invalid QR code data", 400));
    }

    const participant = await Participant.findOne({ teamId });
    if (!participant) {
      return res.status(404).json(formatResponse(null, "Team not found", 404));
    }

    // Check if team has enough points
    if (participant.totalPoints < points) {
      return res
        .status(400)
        .json(
          formatResponse(
            null,
            `Insufficient points. Team has ${participant.totalPoints} points, cannot subtract ${points}`,
            400
          )
        );
    }

    // Create a penalty record in gameProgress with negative points
    participant.gameProgress.push({
      gameId: null, // No specific game for penalty
      points: -points, // Negative points for subtraction
      assignedBy: {
        adminId: req.adminId,
        adminName: req.adminName,
        adminEmail: req.adminEmail,
      },
      penalty: {
        reason: reason || "Points deducted by admin",
        isDeduction: true,
      },
    });

    // Subtract points from total
    participant.totalPoints -= points;
    await participant.save();

    res.json(
      formatResponse(
        {
          teamId: participant.teamId,
          teamName: participant.teamName,
          pointsSubtracted: points,
          newTotalPoints: participant.totalPoints,
          reason: reason || "Points deducted by admin",
          deductedBy: req.adminName,
          timestamp: new Date(),
        },
        `${points} points deducted successfully by ${req.adminName}`
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};

export const subtractPointsByTeamId = async (req, res) => {
  try {
    const { teamId, points, reason } = req.body;
    console.log("Subtract Points Request:", { teamId, points, reason });

    if (!teamId || !points) {
      return res
        .status(400)
        .json(formatResponse(null, "Team ID and points are required", 400));
    }
    console.log("After team and points check");

    // if (points <= 0) {
    //   return res
    //     .status(400)
    //     .json(formatResponse(null, "Points must be greater than 0", 400));
    // }

    const participant = await Participant.findOne({ teamId: parseInt(teamId) });
    if (!participant) {
      return res.status(404).json(formatResponse(null, "Team not found", 404));
    }
    console.log("After participant check");

    // Check if team has enough points
    if (participant.totalPoints < points) {
      return res
        .status(400)
        .json(
          formatResponse(
            null,
            `Insufficient points. Team has ${participant.totalPoints} points, cannot subtract ${points}`,
            400
          )
        );
    }
    console.log("[LOGS] After total points check");

    // Create a penalty record in gameProgress with negative points
    participant.gameProgress.push({
      gameId: null, // No specific game for penalty
      points: -points, // Negative points for subtraction
      assignedBy: {
        adminId: req.adminId,
        adminName: req.adminName,
        adminEmail: req.adminEmail,
      },
      penalty: {
        reason: reason || "Points deducted by admin",
        isDeduction: true,
      },
    });

    // Subtract points from total
    participant.totalPoints -= points;
    await participant.save();

    console.log("[LOGS] After participant save");
    console.log("[LOGS] sample response", {
      teamId: participant.teamId,
      teamName: participant.teamName,
      pointsSubtracted: points,
      newTotalPoints: participant.totalPoints,
      reason: reason || "Points deducted by admin",
      deductedBy: req.adminName,
      timestamp: new Date(),
    });
    res.json(
      formatResponse(
        {
          teamId: participant.teamId,
          teamName: participant.teamName,
          pointsSubtracted: points,
          newTotalPoints: participant.totalPoints,
          reason: reason || "Points deducted by admin",
          deductedBy: req.adminName,
          timestamp: new Date(),
        },
        `${points} points deducted successfully by ${req.adminName}`
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};

export const changePointsByTeamId = async (req, res) => {
  try {
    const { gameId, teamId, points, reason } = req.body;
    console.log("Points Change Request:", { teamId, points, reason });

    if (!gameId || !teamId || points === undefined || points === null) {
      return res
        .status(400)
        .json(formatResponse(null, "Team ID and points are required", 400));
    }
    console.log("After team and points check");

    const participant = await Participant.findOne({ teamId: parseInt(teamId) });
    if (!participant) {
      return res.status(404).json(formatResponse(null, "Team not found", 404));
    }
    console.log("After participant check");

    // const game = await Game.findOne({ gameId });
    // const game = await Game.findOne({ _id: mongoose.Types.ObjectId(gameId) });
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json(formatResponse(null, "Game not found", 404));
    }
    console.log("After game check");

    // Check if team has enough points
    if (participant.totalPoints < points) {
      return res
        .status(400)
        .json(
          formatResponse(
            null,
            `Insufficient points. Team has ${participant.totalPoints} points, cannot subtract ${points}`,
            400
          )
        );
    }
    console.log("[LOGS] After total points check");

    // Create a penalty record in gameProgress with negative points
    participant.gameProgress.push({
      gameId: gameId, // No specific game for penalty
      points: points,
      assignedBy: {
        adminId: req.adminId,
        adminName: req.adminName,
        adminEmail: req.adminEmail,
      },
      penalty: {
        reason: reason || "Points changed by admin",
        isDeduction: true,
      },
    });

    // Add points to total
    participant.totalPoints += points;
    await participant.save();

    console.log("[LOGS] After participant save");
    console.log("[LOGS] sample response", {
      teamId: participant.teamId,
      teamName: participant.teamName,
      pointsSubtracted: points,
      newTotalPoints: participant.totalPoints,
      reason: reason || "Points chaged by admin",
      deductedBy: req.adminName,
      timestamp: new Date(),
    });
    res.json(
      formatResponse(
        {
          teamId: participant.teamId,
          teamName: participant.teamName,
          pointsSubtracted: points,
          newTotalPoints: participant.totalPoints,
          reason: reason || "Points chaneg by admin",
          deductedBy: req.adminName,
          timestamp: new Date(),
        },
        `${points} points changed successfully by ${req.adminName}`
      )
    );
  } catch (error) {
    handleError(error, res);
  }
};
