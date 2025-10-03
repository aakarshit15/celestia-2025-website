import jwt from "jsonwebtoken";
import { Admin } from "../models/index.js";

// Verify JWT token and check if admin exists
export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(403).json({ message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if admin exists and is active
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    req.adminName = decoded.name;
    req.adminRole = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token!" });
  }
};

// Check if admin is superadmin
export const isSuperAdmin = (req, res, next) => {
  if (req.adminRole !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Access denied. Superadmin privileges required." });
  }
  next();
};

// Log admin activity
export const logActivity = (action) => {
  return async (req, res, next) => {
    try {
      const admin = await Admin.findById(req.adminId);
      if (admin) {
        const description = `${action} by ${req.adminName} (${req.adminEmail})`;
        await admin.addActivityLog(action, description);
      }
      next();
    } catch (error) {
      console.error("Activity logging error:", error);
      next(); // Continue even if logging fails
    }
  };
};

export default { authenticateAdmin, isSuperAdmin, logActivity };
