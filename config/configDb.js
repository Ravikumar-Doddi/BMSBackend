const mongoose = require("mongoose");

async function connectToDatabase(dbUrl) {
  console.log("Connecting to the database...");
  if (!dbUrl) {
    throw new Error("Database URL is not defined in .env file");
  }

  try {
    await mongoose.connect(dbUrl);
    console.log("Connected to the database successfully");
  } catch (error) {
    console.log(error);
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

module.exports = connectToDatabase;
