// Bring in the DB connection and the Trip schema
const mongoose = require("./db"); // Adjust path if necessary
const Trip = require("./travlr");

// Read seed data from JSON file
const fs = require("fs");
const path = require("path");

// Corrected path to trips.json using __dirname
const tripsFilePath = path.join(__dirname, "../../data/trips.json");

// Check if trips.json exists before proceeding
if (!fs.existsSync(tripsFilePath)) {
    console.error("Error: trips.json file not found at:", tripsFilePath);
    process.exit(1);
}

console.log("Loading trips.json from:", tripsFilePath);

let trips;
try {
    // Read and parse JSON data safely
    const tripsData = fs.readFileSync(tripsFilePath, "utf8");
    trips = JSON.parse(tripsData);
} catch (error) {
    console.error("Error parsing trips.json:", error);
    process.exit(1);
}

// Function to seed the database
const seedDB = async () => {
    try {
        console.log("Deleting existing trips...");
        await Trip.deleteMany({}); // Clear existing records
        console.log("Inserting new trips...");
        await Trip.insertMany(trips); // Insert seed data
        console.log("Database successfully seeded with trip data.");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Close MongoDB connection and exit process
seedDB().then(async () => {
    console.log("Closing MongoDB connection...");
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
    process.exit(0);
});
