import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/index.js";

dotenv.config();

const admins = [
  {
    name: "Yash Manek",
    email: "yashmanek2001@gmail.com",
    password: "Yash@2025",
    role: "superadmin",
  },
  {
    name: "Aakarshit Saxena",
    email: "aakarshitsaxena02468@gmail.com",
    password: "Aakarshit@2025",
    role: "admin",
  },
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/celestia"
    );
    console.log("Connected to MongoDB");

    // Clear existing admins
    await Admin.deleteMany({});
    console.log("Cleared existing admins");

    // Create new admins
    for (const adminData of admins) {
      const admin = new Admin(adminData);
      await admin.save();
      console.log(`✅ Created admin: ${admin.name} (${admin.email})`);
    }

    console.log("\n🎉 All 7 admins created successfully!");
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
