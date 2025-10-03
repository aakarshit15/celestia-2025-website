import express from "express";
import { adminController } from "../controllers/index.js";
import { authenticateAdmin, isSuperAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", adminController.loginAdmin);

// Protected routes (require authentication)
router.get("/profile", authenticateAdmin, adminController.getAdminProfile);

// Superadmin only routes
router.post(
  "/create",
  authenticateAdmin,
  isSuperAdmin,
  adminController.createAdmin
);

router.get(
  "/all",
  authenticateAdmin,
  isSuperAdmin,
  adminController.getAllAdmins
);

router.get(
  "/activity-logs/:adminId",
  authenticateAdmin,
  isSuperAdmin,
  adminController.getAdminActivityLogs
);

router.patch(
  "/deactivate/:adminId",
  authenticateAdmin,
  isSuperAdmin,
  adminController.deactivateAdmin
);

export default router;
