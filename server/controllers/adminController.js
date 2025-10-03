import { Admin } from "../models/index.js";
import { formatResponse, handleError } from "../utils/helpers.js";
import jwt from "jsonwebtoken";

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
