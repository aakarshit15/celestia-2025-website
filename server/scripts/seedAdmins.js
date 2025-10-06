import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/index.js";

dotenv.config();

const admins = [
  {}
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI 
    );
    console.log("Connected to MongoDB");

    // Create new admins
    for (const adminData of admins) {
      const admin = new Admin(adminData);
      await admin.save();
      console.log(`✅ Created admin: ${admin.name} (${admin.email})`);
    }
    console.log("\nLogin credentials:");
    admins.forEach((admin) => {
      console.log(`\nEmail: ${admin.email}`);
      console.log(`Password: ${admin.password}`);
      console.log(`Role: ${admin.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admins:", error);
    process.exit(1);
  }
};

seedAdmins();
