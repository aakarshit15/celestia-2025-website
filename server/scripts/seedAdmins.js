import mongoose from "mongoose";
import dotenv from "dotenv";
import { Admin } from "../models/index.js";

dotenv.config();

const admins = [
  {
    name: "Pranav Ahuja",
    email: "pranavahuja28@gmail.com",
    password: "pranavahuja",
    role: "admin",
    isActive: true,
  },
];

const seedAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    const stats = {
      created: [],
      skipped: [],
      failed: [],
    };

    // Create new admins
    for (const adminData of admins) {
      try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: adminData.email });

        if (existingAdmin) {
          console.log(
            `⊘ Skipped (already exists): ${adminData.name} (${adminData.email})`
          );
          stats.skipped.push({
            name: adminData.name,
            email: adminData.email,
            reason: "Email already exists in database",
          });
          continue;
        }

        const admin = new Admin(adminData);
        await admin.save();
        console.log(`✅ Created admin: ${admin.name} (${admin.email})`);
        stats.created.push({
          name: admin.name,
          email: admin.email,
          role: admin.role,
        });
      } catch (error) {
        console.log(
          `❌ Failed to create: ${adminData.name} (${adminData.email}) - ${error.message}`
        );
        stats.failed.push({
          name: adminData.name,
          email: adminData.email,
          reason: error.message,
        });
      }
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 SEEDING SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Successfully Created: ${stats.created.length}`);
    console.log(`⊘ Skipped (Duplicates): ${stats.skipped.length}`);
    console.log(`❌ Failed: ${stats.failed.length}`);
    console.log(`📋 Total Processed: ${admins.length}`);
    console.log("=".repeat(60));

    // Print duplicate details
    if (stats.skipped.length > 0) {
      console.log("\n⚠️  DUPLICATE EMAILS FOUND:");
      console.log("=".repeat(60));
      stats.skipped.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name} - ${admin.email}`);
        console.log(`   Reason: ${admin.reason}\n`);
      });
    }

    // Print login credentials for created admins
    if (stats.created.length > 0) {
      console.log("\n✅ LOGIN CREDENTIALS (Newly Created):");
      console.log("=".repeat(60));
      stats.created.forEach((admin) => {
        const originalAdmin = admins.find((a) => a.email === admin.email);
        console.log(`\nName: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${originalAdmin.password}`);
        console.log(`Role: ${admin.role}`);
      });
    }

    console.log("\n" + "=".repeat(60));
    console.log("✓ Seeding completed successfully!");
    console.log("=".repeat(60) + "\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admins:", error);
    process.exit(1);
  }
};

seedAdmins();
